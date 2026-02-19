/* ftx-search-app.js — Full-text search client for sharded inverted index */
(function () {
  "use strict";

  // === CONFIG ===
  const FTX_BASE = "./data/ftx/";
  const MANIFEST_URL = FTX_BASE + "manifest.json";
  const DOCS_URL = FTX_BASE + "docs.json";
  const DOJ_RECORDS = "https://www.justice.gov/epstein";
  const RESULTS_PER_PAGE = 50;
  const SHARD_PREFIX_LEN = 2;

  // === DOM ===
  const el = {
    input: document.getElementById("ftxInput"),
    searchBtn: document.getElementById("ftxSearchBtn"),
    folderFilter: document.getElementById("ftxFolderFilter"),
    datasetFilter: document.getElementById("ftxDatasetFilter"),
    sortField: document.getElementById("ftxSortField"),
    status: document.getElementById("ftxStatus"),
    results: document.getElementById("ftxResults"),
    loadMore: document.getElementById("ftxLoadMore"),
    loadMoreBtn: document.getElementById("ftxLoadMoreBtn"),
    docCount: document.getElementById("ftxDocCount"),
    info: document.getElementById("ftxInfo"),
  };

  // === STATE ===
  let manifest = null;     // {generated, docs, terms, shards, shard_index}
  let docs = null;         // [[efta, dataset, org_folder, words], ...]
  let shardCache = {};     // prefix -> {term: [delta-encoded doc_ids]}
  let currentResults = []; // filtered+sorted doc indices
  let visibleCount = 0;
  let searchAbort = null;  // AbortController for in-flight fetches

  // === INIT ===
  async function init() {
    setStatus("Loading search index...");
    try {
      const [mRes, dRes] = await Promise.all([
        fetch(MANIFEST_URL, { cache: "no-store" }),
        fetch(DOCS_URL, { cache: "no-store" }),
      ]);
      if (!mRes.ok) throw new Error("Failed to load manifest: " + mRes.status);
      if (!dRes.ok) throw new Error("Failed to load docs: " + dRes.status);
      manifest = await mRes.json();
      docs = await dRes.json();
      el.docCount.textContent = numberFmt(docs.length);
      setStatus("Ready. Enter a search term above.");
    } catch (err) {
      setStatus("Error loading index: " + err.message);
      console.error(err);
    }
  }

  // === SEARCH ===
  async function performSearch() {
    if (!manifest || !docs) return;
    const raw = (el.input.value || "").trim().toLowerCase();
    if (!raw) {
      setStatus("Enter one or more search terms.");
      el.results.innerHTML = "";
      el.loadMore.hidden = true;
      return;
    }

    // Tokenize query
    const terms = raw.match(/[a-z][a-z0-9]{2,}/g);
    if (!terms || terms.length === 0) {
      setStatus("Please enter at least one word with 3+ characters.");
      return;
    }

    // Cancel any in-flight search
    if (searchAbort) searchAbort.abort();
    searchAbort = new AbortController();
    const signal = searchAbort.signal;

    setStatus("Searching for: " + terms.join(" + ") + " ...");
    el.results.innerHTML = "";
    el.loadMore.hidden = true;

    try {
      // Determine which shards we need
      const prefixes = [...new Set(terms.map(t => t.substring(0, SHARD_PREFIX_LEN)))];
      
      // Fetch needed shards
      const fetchPromises = prefixes
        .filter(p => !shardCache[p] && manifest.shard_index[p])
        .map(async (p) => {
          const url = FTX_BASE + p + ".json";
          const r = await fetch(url, { signal });
          if (!r.ok) throw new Error("Shard " + p + " HTTP " + r.status);
          shardCache[p] = await r.json();
        });

      if (fetchPromises.length > 0) {
        setStatus("Loading " + fetchPromises.length + " index shard(s)...");
        await Promise.all(fetchPromises);
      }

      if (signal.aborted) return;

      // Look up each term
      const termPostings = [];
      const missingTerms = [];
      for (const term of terms) {
        const prefix = term.substring(0, SHARD_PREFIX_LEN);
        const shard = shardCache[prefix];
        if (!shard || !shard[term]) {
          missingTerms.push(term);
          continue;
        }
        // Decode delta-encoded posting list
        const deltas = shard[term];
        const ids = new Array(deltas.length);
        ids[0] = deltas[0];
        for (let i = 1; i < deltas.length; i++) {
          ids[i] = ids[i - 1] + deltas[i];
        }
        termPostings.push({ term, ids: new Set(ids), count: ids.length });
      }

      if (missingTerms.length > 0 && termPostings.length === 0) {
        setStatus("No results. Terms not found: " + missingTerms.join(", "));
        return;
      }

      // Intersect posting lists (AND logic)
      let resultSet;
      if (termPostings.length === 0) {
        resultSet = new Set();
      } else {
        // Start with smallest posting list for efficiency
        termPostings.sort((a, b) => a.count - b.count);
        resultSet = new Set(termPostings[0].ids);
        for (let i = 1; i < termPostings.length; i++) {
          const next = termPostings[i].ids;
          for (const id of resultSet) {
            if (!next.has(id)) resultSet.delete(id);
          }
        }
      }

      if (signal.aborted) return;

      // Apply filters
      const folderVal = el.folderFilter.value;
      const dsVal = el.datasetFilter.value;
      let filtered = [...resultSet];
      if (folderVal !== "all") {
        filtered = filtered.filter(id => docs[id][2] === folderVal);
      }
      if (dsVal !== "all") {
        filtered = filtered.filter(id => docs[id][1] === dsVal);
      }

      // Sort
      const sortVal = el.sortField.value;
      if (sortVal === "relevance") {
        // More matching terms + more words = higher relevance
        // Since we already AND'd, sort by word count desc (proxy for detail)
        filtered.sort((a, b) => docs[b][3] - docs[a][3]);
      } else if (sortVal === "words-desc") {
        filtered.sort((a, b) => docs[b][3] - docs[a][3]);
      } else if (sortVal === "words-asc") {
        filtered.sort((a, b) => docs[a][3] - docs[b][3]);
      } else if (sortVal === "efta-asc") {
        filtered.sort((a, b) => docs[a][0].localeCompare(docs[b][0]));
      } else if (sortVal === "efta-desc") {
        filtered.sort((a, b) => docs[b][0].localeCompare(docs[a][0]));
      }

      currentResults = filtered;
      visibleCount = 0;

      const note = missingTerms.length > 0
        ? " (terms not indexed: " + missingTerms.join(", ") + ")"
        : "";
      setStatus(numberFmt(filtered.length) + " documents found" + note);
      showMore();
    } catch (err) {
      if (err.name === "AbortError") return;
      setStatus("Search error: " + err.message);
      console.error(err);
    }
  }

  // === RENDER ===
  function showMore() {
    const end = Math.min(visibleCount + RESULTS_PER_PAGE, currentResults.length);
    const frag = document.createDocumentFragment();
    for (let i = visibleCount; i < end; i++) {
      frag.appendChild(renderResult(currentResults[i]));
    }
    el.results.appendChild(frag);
    visibleCount = end;
    el.loadMore.hidden = visibleCount >= currentResults.length;
  }

  function renderResult(docId) {
    const [efta, dataset, folder, words] = docs[docId];
    const eftaNum = efta.replace(/^EFTA0*/, "");
    // DOJ removed individual PDF links; link to records page + copy button

    const div = document.createElement("div");
    div.className = "ftx-result";
    div.innerHTML =
      '<div class="ftx-result-head">' +
        '<span class="ftx-result-efta">' +
          escHtml(efta) +
        '</span>' +
        '<div class="ftx-result-chips">' +
          '<span class="ftx-chip chip-folder">' + escHtml(folder) + '</span>' +
          '<span class="ftx-chip chip-ds">' + escHtml(dataset) + '</span>' +
          '<span class="ftx-chip">' + numberFmt(words) + ' words</span>' +
        '</div>' +
      '</div>' +
      '<div class="ftx-result-actions">' +
        '<a href="' + DOJ_RECORDS + '?query=' + encodeURIComponent(efta) + '" target="_blank" rel="noopener">DOJ Records &rarr;</a>' +
        '<button class="ftx-copy-btn" onclick="navigator.clipboard.writeText(\'' + escHtml(efta) + '\');this.textContent=\'Copied!\';setTimeout(()=>this.textContent=\'\ud83d\udccb Copy EFTA ID\',1500)">\ud83d\udccb Copy EFTA ID</button>' +
        '<a href="#" class="ftx-view-btn" onclick="openFtxPanel(\'' + escHtml(efta) + '\',this);return false;">View Content</a>' +
      '</div>';
    return div;
  }

  // === UTIL ===
  function setStatus(msg) {
    el.status.textContent = msg;
  }

  function numberFmt(n) {
    return new Intl.NumberFormat("en-US").format(n);
  }

  function escHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // === EVENTS ===
  el.searchBtn.addEventListener("click", performSearch);
  el.input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") performSearch();
  });
  el.loadMoreBtn.addEventListener("click", showMore);
  el.folderFilter.addEventListener("change", function () {
    if (currentResults.length > 0) performSearch();
  });
  el.datasetFilter.addEventListener("change", function () {
    if (currentResults.length > 0) performSearch();
  });
  el.sortField.addEventListener("change", function () {
    if (currentResults.length > 0) performSearch();
  });

  // Support ?q=... in URL
  const urlQ = new URLSearchParams(location.search).get("q");
  if (urlQ) {
    el.input.value = urlQ;
    init().then(performSearch);
  } else {
    init();
  }
})();
