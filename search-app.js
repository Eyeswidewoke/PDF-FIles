(function () {
  const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp", ".jp2", ".tif", ".tiff"]);
  const JSON_EXTS = new Set([".json", ".jsonl"]);
  const TEXT_EXTS = new Set([".md", ".txt", ".csv", ".tsv", ".log", ".xml", ".html", ".js", ".py", ".ps1"]);
  const SORT_FIELDS = new Set(["modified", "label", "collection", "category", "size", "path"]);
  const SORT_DIRS = new Set(["asc", "desc"]);
  const PAGE_SIZES = new Set([100, 200, 500, 1000]);
  const DEFAULT_PAGE_SIZE = 200;
  const SEARCH_DEBOUNCE_MS = 140;
  const MAX_TEXT_VIEWER_CHARS = 350000;

  const el = {
    searchInput: document.getElementById("searchInput"),
    collectionFilter: document.getElementById("collectionFilter"),
    sourceFilter: document.getElementById("sourceFilter"),
    categoryFilter: document.getElementById("categoryFilter"),
    fileTypeFilter: document.getElementById("fileTypeFilter"),
    sortField: document.getElementById("sortField"),
    sortDir: document.getElementById("sortDir"),
    pageSizeFilter: document.getElementById("pageSizeFilter"),
    clearFiltersBtn: document.getElementById("clearFiltersBtn"),
    resultMeta: document.getElementById("resultMeta"),
    resultList: document.getElementById("resultList"),
    loadMoreBtn: document.getElementById("loadMoreBtn"),
    statusLine: document.getElementById("statusLine"),
    viewerPanel: document.getElementById("viewerPanel"),
    viewerTitle: document.getElementById("viewerTitle"),
    viewerMeta: document.getElementById("viewerMeta"),
    viewerMarkdown: document.getElementById("viewerMarkdown"),
    viewerText: document.getElementById("viewerText"),
    viewerImage: document.getElementById("viewerImage"),
    viewerFrame: document.getElementById("viewerFrame"),
    closeViewerBtn: document.getElementById("closeViewerBtn"),
  };

  const state = {
    payload: null,
    flattened: [],
    filtered: [],
    query: "",
    collection: "all",
    source: "all",
    category: "all",
    fileType: "all",
    sortField: "modified",
    sortDir: "desc",
    pageSize: DEFAULT_PAGE_SIZE,
    visibleCount: DEFAULT_PAGE_SIZE,
    viewerToken: 0,
    viewerPath: null,
    requestedOpenPath: "",
  };

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/`/g, "&#96;");
  }

  function setText(node, value) {
    if (!node) return;
    node.textContent = value == null || value === "" ? "-" : String(value);
  }

  function numberFmt(value) {
    return new Intl.NumberFormat("en-US").format(Number(value) || 0);
  }

  function sizeFmt(bytes) {
    const num = Number(bytes);
    if (!Number.isFinite(num) || num <= 0) return "-";
    if (num < 1024) return `${num} B`;
    if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
    if (num < 1024 * 1024 * 1024) return `${(num / (1024 * 1024)).toFixed(1)} MB`;
    return `${(num / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }

  function normalizePath(value) {
    return String(value || "").replace(/\\/g, "/");
  }

  function normalizePathLower(value) {
    return normalizePath(value).toLowerCase();
  }

  function extname(pathValue) {
    const value = String(pathValue || "");
    const match = value.match(/(\.[^./\\]+)$/);
    return match ? match[1].toLowerCase() : "";
  }

  function extensionFromPath(path) {
    return extname(path);
  }

  function fileTypeFromExtension(ext) {
    if (ext === ".pdf") return "pdf";
    if (ext === ".md") return "markdown";
    if (JSON_EXTS.has(ext)) return "json";
    if (IMAGE_EXTS.has(ext)) return "image";
    if (TEXT_EXTS.has(ext)) return "text";
    if (ext) return "other";
    return "unknown";
  }

  function compareText(a, b) {
    return String(a || "").localeCompare(String(b || ""), undefined, {
      numeric: true,
      sensitivity: "base",
    });
  }

  function candidateUrls(pathValue) {
    let path = String(pathValue || "").trim().replace(/\\/g, "/");
    if (!path) return [];
    if (/^https?:\/\//i.test(path)) return [path];
    path = path.replace(/^\.\/+/, "");

    const urls = [];
    const add = (url) => {
      if (url && !urls.includes(url)) urls.push(url);
    };

    if (path.startsWith("/")) {
      add(path);
      add(`.${path}`);
      return urls;
    }

    add(`./${path}`);
    add(`../${path}`);
    add(`../../${path}`);
    add(`../../../${path}`);
    add(`/${path}`);
    if (!path.startsWith("public_bundle/")) {
      add(`./public_bundle/${path}`);
      add(`../public_bundle/${path}`);
      add(`../../public_bundle/${path}`);
    }
    return urls;
  }

  function normalizeLocalHref(href) {
    if (!href) return null;
    if (/^(https?:|mailto:|tel:|#)/i.test(href)) return null;
    let value = String(href).trim();
    if (!value) return null;
    try {
      value = decodeURIComponent(value);
    } catch (_) {
      // keep raw href
    }
    value = value.replace(/\\/g, "/").replace(/^\.\//, "").replace(/^\/+/, "");
    return value || null;
  }

  function resolveBundleLink(href, basePath) {
    const local = normalizeLocalHref(href);
    if (!local) return null;
    if (local.startsWith("content/")) return local;
    if (local.startsWith("../") || local.startsWith("./")) {
      const base = String(basePath || "").replace(/\\/g, "/");
      const baseDir = base.includes("/") ? base.slice(0, base.lastIndexOf("/") + 1) : "";
      try {
        return new URL(local, `https://bundle.local/${baseDir}`).pathname.replace(/^\/+/, "");
      } catch (_) {
        return local.replace(/^\.\/+/, "");
      }
    }
    return local;
  }

  function findArtifactByPath(pathValue) {
    const target = normalizePathLower(pathValue);
    if (!target) return null;
    const exact =
      state.flattened.find((item) => normalizePathLower(item.path || "") === target) || null;
    if (exact) return exact;
    return (
      state.flattened.find((item) => normalizePathLower(item.path || "").endsWith(target)) ||
      null
    );
  }

  function isHiddenArtifact(item) {
    if (!item) return false;
    const path = normalizePathLower(item.path || "");
    const label = String(item.label || "").toLowerCase();

    if (!path && !label) return false;
    if (path.includes("verify-queue.md")) return true;
    if (path.includes("/12_fictional_trial/") || path.includes("12-fictional-trial")) return true;
    if (path.includes("/content/cast/profiles/00_master/narrator.md")) return true;
    if (path.includes("/content/cast/pages/00-master-narrator.md")) return true;
    if (path.includes("/content/emails/people-buckets/master/narrator.md")) return true;
    if (path.includes("/content/cast/profiles/cast.md")) return true;
    if (path.includes("/content/cast/profiles/cast hub.md")) return true;
    if (path.includes("/content/cast/pages/cast.md")) return true;
    if (path.includes("/content/cast/pages/cast-hub.md")) return true;
    if (path.includes("/content/emails/people-buckets/general/cast.md")) return true;
    if (path.includes("/content/emails/people-buckets/general/cast-hub.md")) return true;

    if (label === "narrator.md") return true;
    if (label === "cast.md" || label === "cast hub.md") return true;
    if (label.includes("narrator (cast page).md")) return true;
    if (label.includes("narrator (people bucket).md")) return true;
    if (label.includes("cast (cast page).md")) return true;
    if (label.includes("cast hub (cast page).md")) return true;
    if (label.includes("cast (people bucket).md")) return true;
    if (label.includes("cast hub (people bucket).md")) return true;
    return false;
  }

  function sanitizePageSize(value) {
    const n = Number(value);
    return PAGE_SIZES.has(n) ? n : DEFAULT_PAGE_SIZE;
  }

  function parseUrlState() {
    const params = new URLSearchParams(window.location.search);
    state.query = (params.get("q") || "").trim();
    state.collection = (params.get("collection") || "all").trim() || "all";
    state.source = (params.get("source") || "all").trim() || "all";
    state.category = (params.get("category") || "all").trim() || "all";
    state.fileType = (params.get("type") || "all").trim() || "all";
    state.requestedOpenPath = (params.get("open") || "").trim();

    const sortField = (params.get("sort") || "modified").trim();
    state.sortField = SORT_FIELDS.has(sortField) ? sortField : "modified";
    const sortDir = (params.get("dir") || "desc").trim();
    state.sortDir = SORT_DIRS.has(sortDir) ? sortDir : "desc";

    const pageSize = sanitizePageSize(params.get("limit"));
    state.pageSize = pageSize;
    state.visibleCount = pageSize;
  }

  function pushUrlState() {
    const params = new URLSearchParams();
    if (state.query) params.set("q", state.query);
    if (state.collection !== "all") params.set("collection", state.collection);
    if (state.source !== "all") params.set("source", state.source);
    if (state.category !== "all") params.set("category", state.category);
    if (state.fileType !== "all") params.set("type", state.fileType);
    if (state.sortField !== "modified") params.set("sort", state.sortField);
    if (state.sortDir !== "desc") params.set("dir", state.sortDir);
    if (state.pageSize !== DEFAULT_PAGE_SIZE) params.set("limit", String(state.pageSize));
    if (state.viewerPath) params.set("open", state.viewerPath);

    const query = params.toString();
    const target = query ? `${window.location.pathname}?${query}` : window.location.pathname;
    history.replaceState(null, "", target);
  }

  async function loadPayload() {
    const response = await fetch("./data/public-data.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} loading data/public-data.json`);
    }
    return response.json();
  }

  function flattenCollections(payload) {
    const out = [];
    const collections = Array.isArray(payload.collections) ? payload.collections : [];
    collections.forEach((collection) => {
      const items = Array.isArray(collection.items) ? collection.items : [];
      items.forEach((item) => {
        if (!item || isHiddenArtifact(item)) return;
        const path = normalizePath(item.path || "");
        const ext = extensionFromPath(path);
        out.push({
          ...item,
          path,
          extension: ext,
          file_type: fileTypeFromExtension(ext),
          size_bytes: Number(item.size_bytes) || 0,
          modified_ms: Date.parse(String(item.modified || "")) || 0,
          map_keys: Array.isArray(item.map_keys) ? item.map_keys : [],
          collection_id: collection.id || "unknown",
          collection_title: collection.title || collection.id || "Collection",
        });
      });
    });
    return out;
  }

  function setSelectOptions(select, values, allLabel) {
    if (!select) return;
    const unique = [...new Set(values.filter(Boolean))].sort(compareText);
    select.innerHTML = "";
    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = allLabel;
    select.appendChild(allOption);
    unique.forEach((value) => {
      const opt = document.createElement("option");
      opt.value = value;
      opt.textContent = value;
      select.appendChild(opt);
    });
  }

  function optionExists(select, value) {
    if (!select) return false;
    return [...select.options].some((opt) => opt.value === value);
  }

  function syncInputsFromState() {
    if (el.searchInput) el.searchInput.value = state.query;
    if (el.collectionFilter && optionExists(el.collectionFilter, state.collection)) el.collectionFilter.value = state.collection;
    if (el.sourceFilter && optionExists(el.sourceFilter, state.source)) el.sourceFilter.value = state.source;
    if (el.categoryFilter && optionExists(el.categoryFilter, state.category)) el.categoryFilter.value = state.category;
    if (el.fileTypeFilter && optionExists(el.fileTypeFilter, state.fileType)) el.fileTypeFilter.value = state.fileType;
    if (el.sortField) el.sortField.value = state.sortField;
    if (el.sortDir) el.sortDir.value = state.sortDir;
    if (el.pageSizeFilter) el.pageSizeFilter.value = String(state.pageSize);
  }

  function normalizeStateToOptions() {
    if (!optionExists(el.collectionFilter, state.collection)) state.collection = "all";
    if (!optionExists(el.sourceFilter, state.source)) state.source = "all";
    if (!optionExists(el.categoryFilter, state.category)) state.category = "all";
    if (!optionExists(el.fileTypeFilter, state.fileType)) state.fileType = "all";
    if (!SORT_FIELDS.has(state.sortField)) state.sortField = "modified";
    if (!SORT_DIRS.has(state.sortDir)) state.sortDir = "desc";
    state.pageSize = sanitizePageSize(state.pageSize);
    if (state.visibleCount < state.pageSize) state.visibleCount = state.pageSize;
  }

  function initFilters() {
    setSelectOptions(
      el.collectionFilter,
      state.flattened.map((item) => item.collection_id),
      "All Collections"
    );
    setSelectOptions(
      el.sourceFilter,
      state.flattened.map((item) => item.source || "unknown"),
      "All Sources"
    );
    setSelectOptions(
      el.categoryFilter,
      state.flattened.map((item) => item.category || "uncategorized"),
      "All Categories"
    );
    setSelectOptions(
      el.fileTypeFilter,
      state.flattened.map((item) => item.file_type || "unknown"),
      "All File Types"
    );
    normalizeStateToOptions();
    syncInputsFromState();
  }

  function matchesQuery(item, query) {
    if (!query) return true;
    const hay = [
      item.label,
      item.path,
      item.note,
      item.category,
      item.source,
      item.collection_id,
      item.collection_title,
      item.file_type,
      (item.map_keys || []).join(" "),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return hay.includes(query);
  }

  function applyFilters(resetVisibleCount) {
    const q = state.query.trim().toLowerCase();
    state.filtered = state.flattened.filter((item) => {
      if (state.collection !== "all" && item.collection_id !== state.collection) return false;
      if (state.source !== "all" && (item.source || "unknown") !== state.source) return false;
      if (state.category !== "all" && (item.category || "uncategorized") !== state.category) return false;
      if (state.fileType !== "all" && (item.file_type || "unknown") !== state.fileType) return false;
      if (!matchesQuery(item, q)) return false;
      return true;
    });

    state.filtered.sort((a, b) => {
      let cmp = 0;
      switch (state.sortField) {
        case "label":
          cmp = compareText(a.label, b.label);
          break;
        case "collection":
          cmp = compareText(a.collection_title, b.collection_title);
          break;
        case "category":
          cmp = compareText(a.category, b.category);
          break;
        case "size":
          cmp = (a.size_bytes || 0) - (b.size_bytes || 0);
          break;
        case "path":
          cmp = compareText(a.path, b.path);
          break;
        case "modified":
        default:
          cmp = (a.modified_ms || 0) - (b.modified_ms || 0);
          break;
      }
      if (cmp === 0) cmp = compareText(a.label, b.label);
      return state.sortDir === "asc" ? cmp : cmp * -1;
    });

    if (resetVisibleCount) state.visibleCount = state.pageSize;
  }

  function itemHref(path) {
    return encodeURI(normalizePath(path));
  }

  function hideViewerContent() {
    if (!el.viewerPanel) return;
    el.viewerMarkdown.hidden = true;
    el.viewerMarkdown.innerHTML = "";
    el.viewerText.hidden = true;
    el.viewerText.textContent = "";
    el.viewerImage.hidden = true;
    el.viewerImage.removeAttribute("src");
    el.viewerFrame.hidden = true;
    el.viewerFrame.removeAttribute("src");
  }

  function setViewerStatus(title, metaText) {
    if (!el.viewerPanel) return;
    setText(el.viewerTitle, title || "File Viewer");
    setText(el.viewerMeta, metaText || "-");
  }

  function showViewer() {
    if (!el.viewerPanel) return;
    el.viewerPanel.hidden = false;
    el.viewerPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function closeViewer() {
    if (!el.viewerPanel) return;
    hideViewerContent();
    el.viewerPanel.hidden = true;
    state.viewerPath = null;
    pushUrlState();
  }

  function markdownToHtml(input) {
    const src = String(input || "").replace(/\r\n/g, "\n");
    const lines = src.split("\n");
    let inCode = false;
    let codeBuf = [];
    let inUl = false;
    let inOl = false;
    const out = [];

    const closeLists = () => {
      if (inUl) {
        out.push("</ul>");
        inUl = false;
      }
      if (inOl) {
        out.push("</ol>");
        inOl = false;
      }
    };

    const inline = (text) => {
      let value = escapeHtml(text);
      const codeTokens = [];
      value = value.replace(/`([^`]+)`/g, (_, code) => {
        const token = `@@CODE${codeTokens.length}@@`;
        codeTokens.push(`<code>${code}</code>`);
        return token;
      });

      value = value
        .replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>")
        .replace(/__([^_\n]+)__/g, "<strong>$1</strong>")
        .replace(/~~([^~\n]+)~~/g, "<del>$1</del>")
        .replace(/(^|[^\w])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>")
        .replace(/(^|[^\w])_([^_\n]+)_(?!_)/g, "$1<em>$2</em>")
        .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" data-inline-link="1">$1</a>');

      return value.replace(/@@CODE(\d+)@@/g, (_, idx) => codeTokens[Number(idx)] || "");
    };

    for (const raw of lines) {
      const line = raw || "";

      if (line.startsWith("```")) {
        closeLists();
        if (!inCode) {
          inCode = true;
          codeBuf = [];
        } else {
          out.push(`<pre><code>${escapeHtml(codeBuf.join("\n"))}</code></pre>`);
          inCode = false;
          codeBuf = [];
        }
        continue;
      }
      if (inCode) {
        codeBuf.push(line);
        continue;
      }

      const heading = line.match(/^(#{1,4})\s+(.+)$/);
      if (heading) {
        closeLists();
        const level = heading[1].length;
        out.push(`<h${level}>${inline(heading[2])}</h${level}>`);
        continue;
      }

      const ul = line.match(/^\s*[-*+]\s+(.+)$/);
      if (ul) {
        if (inOl) {
          out.push("</ol>");
          inOl = false;
        }
        if (!inUl) {
          out.push("<ul>");
          inUl = true;
        }
        out.push(`<li>${inline(ul[1])}</li>`);
        continue;
      }

      const ol = line.match(/^\s*\d+\.\s+(.+)$/);
      if (ol) {
        if (inUl) {
          out.push("</ul>");
          inUl = false;
        }
        if (!inOl) {
          out.push("<ol>");
          inOl = true;
        }
        out.push(`<li>${inline(ol[1])}</li>`);
        continue;
      }

      const quote = line.match(/^\s*>\s?(.*)$/);
      if (quote) {
        closeLists();
        out.push(`<blockquote>${inline(quote[1])}</blockquote>`);
        continue;
      }

      if (!line.trim()) {
        closeLists();
        continue;
      }
      closeLists();
      out.push(`<p>${inline(line)}</p>`);
    }

    if (inCode) out.push(`<pre><code>${escapeHtml(codeBuf.join("\n"))}</code></pre>`);
    closeLists();
    return out.join("\n");
  }

  async function fetchTextFromCandidates(urls) {
    for (const url of urls) {
      try {
        const response = await fetch(url, { cache: "no-store" });
        if (!response.ok) continue;
        const text = await response.text();
        return { url, text };
      } catch (_) {
        // continue
      }
    }
    return null;
  }

  async function resolveReachableUrl(urls) {
    for (const url of urls) {
      try {
        const head = await fetch(url, { method: "HEAD", cache: "no-store" });
        if (head.ok) return url;
      } catch (_) {
        // continue to GET
      }
      try {
        const get = await fetch(url, { cache: "no-store" });
        if (get.ok) return url;
      } catch (_) {
        // continue
      }
    }
    return null;
  }

  function loadImageFromCandidates(urls) {
    return new Promise((resolve) => {
      let index = 0;
      const attempt = () => {
        if (index >= urls.length) {
          resolve(null);
          return;
        }
        const url = urls[index];
        index += 1;
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => attempt();
        img.src = url;
      };
      attempt();
    });
  }

  async function openInViewer(item) {
    if (!el.viewerPanel) return;
    const token = ++state.viewerToken;
    const selected = item || null;
    if (!selected || !selected.path) {
      closeViewer();
      return;
    }

    const ext = extname(selected.path);
    const urls = candidateUrls(selected.path);
    state.viewerPath = selected.path;
    pushUrlState();

    showViewer();
    hideViewerContent();
    setViewerStatus(selected.label || "File Viewer", "Loading...");

    if (!urls.length) {
      setViewerStatus(selected.label || "File Viewer", "No valid path for viewer.");
      return;
    }

    if (IMAGE_EXTS.has(ext)) {
      const imageUrl = await loadImageFromCandidates(urls);
      if (token !== state.viewerToken) return;
      if (!imageUrl) {
        showOfflineNotice(selected);
        return;
      }
      el.viewerImage.src = imageUrl;
      el.viewerImage.hidden = false;
      setViewerStatus(selected.label || "File Viewer", `Image | ${selected.path}`);
      return;
    }

    if (TEXT_EXTS.has(ext)) {
      const loaded = await fetchTextFromCandidates(urls);
      if (token !== state.viewerToken) return;
      if (!loaded) {
        showOfflineNotice(selected);
        return;
      }

      const original = loaded.text || "";
      const truncated = original.length > MAX_TEXT_VIEWER_CHARS;
      const body = truncated
        ? `${original.slice(0, MAX_TEXT_VIEWER_CHARS)}\n\n[Viewer truncated to ${numberFmt(MAX_TEXT_VIEWER_CHARS)} chars]`
        : original;

      if (ext === ".md") {
        el.viewerMarkdown.innerHTML = markdownToHtml(body);
        el.viewerMarkdown.hidden = false;
      } else {
        el.viewerText.textContent = body;
        el.viewerText.hidden = false;
      }

      setViewerStatus(
        selected.label || "File Viewer",
        `${ext === ".md" ? "Markdown" : "Text"} | ${numberFmt(body.length)} chars${truncated ? " (truncated)" : ""}`
      );
      return;
    }

    const reachable = await resolveReachableUrl(urls);
    if (token !== state.viewerToken) return;
    if (!reachable) {
      showOfflineNotice(selected);
      return;
    }

    el.viewerFrame.src = reachable;
    el.viewerFrame.hidden = false;
    setViewerStatus(selected.label || "File Viewer", `Embedded file | ${selected.path}`);
  }

  function showOfflineNotice(selected) {
    const filePath = selected.path || "";
    const fileName = filePath.split("/").pop() || filePath;
    const sizeStr = selected.size_bytes ? sizeFmt(selected.size_bytes) : "";
    const collLabel = selected.collection_title || "";
    const ext = extname(filePath);
    const isImage = IMAGE_EXTS.has(ext);
    const typeLabel = isImage ? "image" : (ext === ".pdf" ? "PDF document" : "file");

    const meta = [
      sizeStr ? `<strong>Size:</strong> ${escapeHtml(sizeStr)}` : "",
      collLabel ? `<strong>Collection:</strong> ${escapeHtml(collLabel)}` : "",
      selected.category ? `<strong>Category:</strong> ${escapeHtml(selected.category)}` : "",
    ].filter(Boolean).join("&nbsp;&nbsp;|&nbsp;&nbsp;");

    const fallbackHtml =
      `<div style="text-align:center;padding:2.5rem 1.5rem;max-width:640px;margin:0 auto;">` +
      `<p style="font-size:2rem;margin-bottom:0.5rem;">📂</p>` +
      `<p style="font-size:1.1rem;color:var(--accent,#bf3b18);font-weight:700;margin-bottom:1rem;">` +
      `File not included in online release</p>` +
      `<p style="margin-bottom:0.75rem;">This ${escapeHtml(typeLabel)} is part of the full Epstein Files archive ` +
      `and is not hosted on this site due to GitHub's size limits.</p>` +
      `<p style="margin-bottom:0.5rem;"><strong>Filename:</strong></p>` +
      `<code style="font-size:0.95rem;background:var(--surface,#1e1c1a);padding:0.4rem 0.8rem;border-radius:4px;display:inline-block;word-break:break-all;max-width:100%;">` +
      `${escapeHtml(fileName)}</code>` +
      `<p style="margin-top:0.75rem;"><strong>Full path:</strong></p>` +
      `<code style="font-size:0.8rem;background:var(--surface,#1e1c1a);padding:0.4rem 0.8rem;border-radius:4px;display:inline-block;word-break:break-all;max-width:100%;">` +
      `${escapeHtml(filePath)}</code>` +
      (meta ? `<p style="margin-top:1rem;font-size:0.85rem;color:var(--muted,#8a7f74);">${meta}</p>` : "") +
      `<p style="margin-top:1.25rem;color:var(--muted,#8a7f74);font-size:0.85rem;">` +
      `The search index catalogs all 58,999 artifacts. File content is available in the ` +
      `<a href="./release-guide.html" style="color:var(--accent,#bf3b18);">official release downloads</a>.</p>` +
      `</div>`;

    el.viewerMarkdown.innerHTML = fallbackHtml;
    el.viewerMarkdown.hidden = false;
    setViewerStatus(selected.label || "File Viewer", `Not hosted online | ${escapeHtml(fileName)}`);
  }

  function renderResults() {
    if (!el.resultList || !el.resultMeta || !el.loadMoreBtn) return;
    el.resultList.innerHTML = "";

    const total = state.filtered.length;
    const shown = state.filtered.slice(0, state.visibleCount);
    const shownCount = shown.length;
    const hiddenCount = Math.max(total - shownCount, 0);

    el.resultMeta.textContent = `Showing ${numberFmt(shownCount)} of ${numberFmt(total)} file(s) from ${numberFmt(state.flattened.length)} indexed artifacts.`;

    if (!shownCount) {
      const empty = document.createElement("p");
      empty.className = "result-meta";
      empty.textContent = "No files match this filter set.";
      el.resultList.appendChild(empty);
      el.loadMoreBtn.hidden = true;
      return;
    }

    const frag = document.createDocumentFragment();
    shown.forEach((item, idx) => {
      const card = document.createElement("article");
      card.className = "search-result";

      const chips = [
        item.collection_title || "Collection",
        item.category || "uncategorized",
        item.source || "unknown",
        item.file_type || "unknown",
      ]
        .filter(Boolean)
        .map((value) => `<span class="search-chip">${escapeHtml(value)}</span>`)
        .join("");

      const metaParts = [
        `size: ${escapeHtml(sizeFmt(item.size_bytes))}`,
        `modified: ${escapeHtml(item.modified || "-")}`,
      ];

      card.innerHTML = [
        "<div class='search-result-head'>",
        `  <h3 class='search-result-title'>${escapeHtml(item.label || "(untitled)")}</h3>`,
        `  <div class='search-result-chips'>${chips}</div>`,
        "</div>",
        `<div class='artifact-path'>${escapeHtml(item.path || "-")}</div>`,
        item.note ? `<p class='search-result-note'>${escapeHtml(item.note)}</p>` : "",
        `<div class='search-result-meta'><span>${metaParts.join("</span><span>")}</span></div>`,
        "<div class='search-result-actions'>",
        `  <button class='action-btn open-viewer-btn' type='button' data-artifact-idx='${idx}'>Open In Site</button>`,
        `  <a class='ghost-btn' href='${escapeAttr(itemHref(item.path))}' target='_blank' rel='noopener'>Raw File</a>`,
        `  <button class='ghost-btn copy-path-btn' type='button' data-path='${escapeAttr(item.path || "")}'>Copy Path</button>`,
        "</div>",
      ].join("");
      frag.appendChild(card);
    });

    el.resultList.appendChild(frag);

    if (hiddenCount > 0) {
      el.loadMoreBtn.hidden = false;
      el.loadMoreBtn.textContent = `Load ${numberFmt(Math.min(hiddenCount, state.pageSize))} More`;
    } else {
      el.loadMoreBtn.hidden = true;
    }
  }

  function setStatus(message) {
    if (!el.statusLine) return;
    el.statusLine.textContent = message || "";
  }

  function debounce(fn, delayMs) {
    let timer = null;
    return function debounced() {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        fn();
      }, delayMs);
    };
  }

  function syncStateFromInputs() {
    state.query = (el.searchInput && el.searchInput.value ? el.searchInput.value : "").trim();
    state.collection = (el.collectionFilter && el.collectionFilter.value) || "all";
    state.source = (el.sourceFilter && el.sourceFilter.value) || "all";
    state.category = (el.categoryFilter && el.categoryFilter.value) || "all";
    state.fileType = (el.fileTypeFilter && el.fileTypeFilter.value) || "all";
    state.sortField = (el.sortField && el.sortField.value) || "modified";
    state.sortDir = (el.sortDir && el.sortDir.value) || "desc";
    state.pageSize = sanitizePageSize((el.pageSizeFilter && el.pageSizeFilter.value) || DEFAULT_PAGE_SIZE);
  }

  function runSearch(resetVisibleCount) {
    syncStateFromInputs();
    applyFilters(Boolean(resetVisibleCount));
    renderResults();
    pushUrlState();
  }

  function wireEvents() {
    if (!el.searchInput) return;

    const debouncedSearch = debounce(() => runSearch(true), SEARCH_DEBOUNCE_MS);
    el.searchInput.addEventListener("input", debouncedSearch);

    [
      el.collectionFilter,
      el.sourceFilter,
      el.categoryFilter,
      el.fileTypeFilter,
      el.sortField,
      el.sortDir,
      el.pageSizeFilter,
    ].forEach((control) => {
      if (!control) return;
      control.addEventListener("change", () => runSearch(true));
    });

    if (el.clearFiltersBtn) {
      el.clearFiltersBtn.addEventListener("click", () => {
        state.query = "";
        state.collection = "all";
        state.source = "all";
        state.category = "all";
        state.fileType = "all";
        state.sortField = "modified";
        state.sortDir = "desc";
        state.pageSize = DEFAULT_PAGE_SIZE;
        state.visibleCount = DEFAULT_PAGE_SIZE;
        syncInputsFromState();
        runSearch(true);
      });
    }

    if (el.loadMoreBtn) {
      el.loadMoreBtn.addEventListener("click", () => {
        state.visibleCount += state.pageSize;
        renderResults();
      });
    }

    if (el.resultList) {
      el.resultList.addEventListener("click", async (event) => {
        const openBtn = event.target.closest(".open-viewer-btn");
        if (openBtn) {
          const idx = Number(openBtn.dataset.artifactIdx);
          const item = Number.isFinite(idx) ? state.filtered[idx] : null;
          if (!item) return;
          await openInViewer(item);
          return;
        }

        const copyBtn = event.target.closest(".copy-path-btn");
        if (!copyBtn) return;
        const path = copyBtn.dataset.path || "";
        if (!path) return;
        try {
          await navigator.clipboard.writeText(path);
          setStatus(`Copied path: ${path}`);
        } catch (_) {
          setStatus("Could not copy path automatically.");
        }
      });
    }

    if (el.closeViewerBtn) {
      el.closeViewerBtn.addEventListener("click", () => closeViewer());
    }

    if (el.viewerMarkdown) {
      el.viewerMarkdown.addEventListener("click", async (event) => {
        const anchor = event.target.closest("a[data-inline-link='1']");
        if (!anchor) return;
        const href = anchor.getAttribute("href");
        if (!href) return;
        const resolved = resolveBundleLink(href, state.viewerPath);
        if (!resolved) return;
        const linked = findArtifactByPath(resolved) || {
          label: resolved.split("/").pop() || "Linked file",
          path: resolved,
        };
        event.preventDefault();
        await openInViewer(linked);
      });
    }
  }

  function renderFatalError(message) {
    if (el.resultMeta) {
      el.resultMeta.textContent = "Search index failed to load.";
    }
    if (el.resultList) {
      el.resultList.innerHTML = `<p class="result-meta">${escapeHtml(message)}</p>`;
    }
  }

  async function init() {
    parseUrlState();
    syncInputsFromState();
    wireEvents();

    try {
      state.payload = await loadPayload();
      state.flattened = flattenCollections(state.payload);
      initFilters();
      runSearch(true);

      if (state.requestedOpenPath) {
        const openItem = findArtifactByPath(state.requestedOpenPath);
        if (openItem) await openInViewer(openItem);
      }
    } catch (error) {
      renderFatalError(String((error && error.message) || error || "Unknown error"));
    }
  }

  init();
})();
