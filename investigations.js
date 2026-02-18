(function () {
  const COLLECTION_ID = "investigation-findings";
  const MAX_TAG_BUTTONS = 24;
  const MAX_CARD_TAGS = 6;

  const el = {
    statsCards: document.getElementById("statsCards"),
    searchInput: document.getElementById("searchInput"),
    categorySelect: document.getElementById("categorySelect"),
    tagRow: document.getElementById("tagRow"),
    resultMeta: document.getElementById("resultMeta"),
    cardsGrid: document.getElementById("cardsGrid"),
    emptyState: document.getElementById("emptyState"),
  };

  const state = {
    items: [],
    filtered: [],
    query: "",
    category: "all",
    tag: "all",
    title: "Investigation Findings",
    description: "",
    generatedAt: "",
    source: "unknown",
  };

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatBytes(value) {
    if (!Number.isFinite(value) || value <= 0) return "-";
    const units = ["B", "KB", "MB", "GB"];
    let n = Number(value);
    let idx = 0;
    while (n >= 1024 && idx < units.length - 1) {
      n /= 1024;
      idx += 1;
    }
    return `${n.toFixed(idx === 0 ? 0 : 1)} ${units[idx]}`;
  }

  function formatDate(value) {
    const raw = String(value || "").trim();
    if (!raw) return "-";
    const dt = new Date(raw);
    if (Number.isNaN(dt.getTime())) return raw;
    return dt.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function normalizePath(path) {
    return String(path || "").replace(/\\/g, "/").replace(/^\/+/, "");
  }

  function toHref(path) {
    const normalized = normalizePath(path);
    if (!normalized) return "#";
    return `./${normalized
      .split("/")
      .map((part) => encodeURIComponent(part))
      .join("/")}`;
  }

  function readMapKeys(item) {
    if (!item || !Array.isArray(item.map_keys)) return [];
    return item.map_keys
      .map((key) => String(key || "").trim())
      .filter(Boolean);
  }

  function loadFromPublicData(payload) {
    const collections = Array.isArray(payload?.collections) ? payload.collections : [];
    const collection = collections.find((entry) => String(entry?.id || "") === COLLECTION_ID);
    if (!collection) return null;

    const rawItems = Array.isArray(collection.items) ? collection.items : [];
    const items = rawItems.map((item) => ({
      label: String(item?.label || "Untitled"),
      path: normalizePath(item?.path || ""),
      source: String(item?.source || "local"),
      category: String(item?.category || "uncategorized"),
      size_bytes: Number(item?.size_bytes || 0),
      modified: String(item?.modified || ""),
      note: String(item?.note || ""),
      map_keys: readMapKeys(item),
    }));

    return {
      title: String(collection.title || "Investigation Findings"),
      description: String(collection.description || ""),
      generatedAt: String(payload?.generated_at || ""),
      source: "public-data.json",
      items,
    };
  }

  function loadFromInvestigationIndex(payload) {
    const reports = Array.isArray(payload?.reports) ? payload.reports : [];
    const findings = Array.isArray(payload?.findings) ? payload.findings : [];
    const supplements = Array.isArray(payload?.supplements) ? payload.supplements : [];
    const generatedAt = String(payload?.generated_at || "");

    const reportItems = reports.map((entry) => ({
      label: String(entry?.label || "Untitled"),
      path: normalizePath(entry?.path || ""),
      source: "local",
      category: "investigation-report",
      size_bytes: Number(entry?.size_bytes || 0),
      modified: "",
      note: "Investigation report",
      map_keys: ["investigation", "report", "docs", "analysis"],
    }));

    const findingItems = findings
      .filter((entry) => entry && entry.path)
      .map((entry) => ({
        label: `F-${String(entry.number || "").padStart(3, "0")} ${String(entry.title || "").trim()}`.trim(),
        path: normalizePath(entry.path),
        source: "local",
        category: "investigation-finding",
        size_bytes: 0,
        modified: "",
        note: "Individual finding page",
        map_keys: ["investigation", "finding", "docs", "analysis"],
      }));

    const supplementItems = supplements
      .filter((entry) => entry && entry.path)
      .map((entry) => {
        const category = String(entry.category || "investigation-supplement");
        const isClaimLedger = category === "claim-ledger";
        return {
          label: String(entry.label || "Supplement"),
          path: normalizePath(entry.path),
          source: "local",
          category,
          size_bytes: Number(entry.size_bytes || 0),
          modified: "",
          note: isClaimLedger ? "Claim ledger generated from findings." : "Supplemental investigation artifact",
          map_keys: isClaimLedger
            ? ["investigation", "claims", "ledger", "verification", "analysis"]
            : ["investigation", "supplement", "docs", "analysis"],
        };
      });

    return {
      title: "Investigation Findings",
      description: "Long-form reports and split findings.",
      generatedAt,
      source: "investigation-index.json",
      items: [...reportItems, ...findingItems, ...supplementItems],
    };
  }

  async function fetchJson(url) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status}`);
    }
    return response.json();
  }

  async function loadPayload() {
    try {
      const publicPayload = await fetchJson("./data/public-data.json");
      const resolved = loadFromPublicData(publicPayload);
      if (resolved) return resolved;
    } catch (_) {
      // Fall through to investigation-index.json.
    }

    const fallback = await fetchJson("./content/docs/investigations/investigation-index.json");
    return loadFromInvestigationIndex(fallback);
  }

  function sortItems(items) {
    return [...items].sort((a, b) => {
      const aTime = Date.parse(String(a.modified || "")) || 0;
      const bTime = Date.parse(String(b.modified || "")) || 0;
      if (bTime !== aTime) return bTime - aTime;
      return String(a.label || "").localeCompare(String(b.label || ""));
    });
  }

  function getCategoryCounts(items) {
    const counts = new Map();
    for (const item of items) {
      const key = String(item.category || "uncategorized");
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    return counts;
  }

  function getTagCounts(items) {
    const counts = new Map();
    for (const item of items) {
      for (const tag of readMapKeys(item)) {
        counts.set(tag, (counts.get(tag) || 0) + 1);
      }
    }
    return counts;
  }

  function categoryLabel(value) {
    return String(value || "")
      .split(/[-_]+/)
      .map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1) : ""))
      .join(" ");
  }

  function applyFilters() {
    const query = state.query.trim().toLowerCase();
    const category = state.category;
    const tag = state.tag;

    state.filtered = state.items.filter((item) => {
      if (category !== "all" && String(item.category) !== category) return false;
      if (tag !== "all" && !readMapKeys(item).includes(tag)) return false;

      if (!query) return true;
      const haystack = [
        item.label,
        item.path,
        item.note,
        item.category,
        ...(item.map_keys || []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }

  function updateResultMeta() {
    const total = state.items.length;
    const shown = state.filtered.length;
    const source = state.source;
    const stamp = state.generatedAt ? `Generated ${formatDate(state.generatedAt)}.` : "";
    el.resultMeta.textContent = `Showing ${shown.toLocaleString()} of ${total.toLocaleString()} items. Source: ${source}. ${stamp}`.trim();
  }

  function renderStats() {
    const categoryCounts = getCategoryCounts(state.items);
    const reportCount = categoryCounts.get("investigation-report") || 0;
    const findingCount = categoryCounts.get("investigation-finding") || 0;
    const indexCount = categoryCounts.get("investigation-index") || 0;

    const stats = [
      { label: "Total Items", value: state.items.length.toLocaleString() },
      { label: "Reports", value: reportCount.toLocaleString() },
      { label: "Findings", value: findingCount.toLocaleString() },
      { label: "Indexes", value: indexCount.toLocaleString() },
    ];

    el.statsCards.innerHTML = stats
      .map(
        (stat) => `
          <article class="stat-card">
            <p class="label">${escapeHtml(stat.label)}</p>
            <p class="value">${escapeHtml(stat.value)}</p>
          </article>
        `
      )
      .join("");
  }

  function renderCategoryOptions() {
    const counts = getCategoryCounts(state.items);
    const options = [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]));

    const existing = [`<option value="all">All Categories</option>`];
    for (const [category, count] of options) {
      const label = `${categoryLabel(category)} (${count.toLocaleString()})`;
      existing.push(`<option value="${escapeHtml(category)}">${escapeHtml(label)}</option>`);
    }
    el.categorySelect.innerHTML = existing.join("");
    el.categorySelect.value = state.category;
  }

  function renderTagButtons() {
    const counts = getTagCounts(state.items);
    const sorted = [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, MAX_TAG_BUTTONS);

    const parts = [
      `<button type="button" class="tag-btn${state.tag === "all" ? " active" : ""}" data-tag="all">All Tags</button>`,
    ];

    for (const [tag, count] of sorted) {
      const active = state.tag === tag ? " active" : "";
      parts.push(
        `<button type="button" class="tag-btn${active}" data-tag="${escapeHtml(tag)}">${escapeHtml(tag)} (${count.toLocaleString()})</button>`
      );
    }

    el.tagRow.innerHTML = parts.join("");

    for (const btn of el.tagRow.querySelectorAll("button[data-tag]")) {
      btn.addEventListener("click", () => {
        const nextTag = String(btn.getAttribute("data-tag") || "all");
        state.tag = nextTag;
        refresh();
      });
    }
  }

  function cardTags(item) {
    const tags = readMapKeys(item).slice(0, MAX_CARD_TAGS);
    if (!tags.length) return "";
    return tags.map((tag) => `<span class="card-tag">${escapeHtml(tag)}</span>`).join("");
  }

  function mapSearchHref(item) {
    const query = encodeURIComponent(item.label || item.path || "");
    return `./map.html?section=explorer&collection=${encodeURIComponent(COLLECTION_ID)}&q=${query}`;
  }

  function renderCards() {
    if (!state.filtered.length) {
      el.cardsGrid.innerHTML = "";
      el.emptyState.hidden = false;
      return;
    }

    el.emptyState.hidden = true;
    const html = state.filtered
      .map((item) => {
        const href = toHref(item.path);
        return `
          <article class="investigation-card">
            <h3><a href="${href}" target="_blank" rel="noopener">${escapeHtml(item.label)}</a></h3>
            <div class="investigation-meta">
              <span>${escapeHtml(categoryLabel(item.category))} &middot; ${escapeHtml(formatBytes(item.size_bytes))}</span>
              <span>${escapeHtml(formatDate(item.modified))}</span>
            </div>
            <div class="investigation-path">${escapeHtml(item.path)}</div>
            <div class="investigation-note">${escapeHtml(item.note || "-")}</div>
            <div class="card-tags">
              <span class="card-tag primary">${escapeHtml(categoryLabel(item.category))}</span>
              ${cardTags(item)}
            </div>
            <div class="card-actions">
              <a class="card-open" href="${href}" target="_blank" rel="noopener">Open File</a>
              <a class="card-map" href="${mapSearchHref(item)}">Find In Explorer</a>
            </div>
          </article>
        `;
      })
      .join("");

    el.cardsGrid.innerHTML = html;
  }

  function refresh() {
    applyFilters();
    updateResultMeta();
    renderTagButtons();
    renderCards();
  }

  function bindEvents() {
    el.searchInput.addEventListener("input", (event) => {
      state.query = String(event.target.value || "");
      refresh();
    });

    el.categorySelect.addEventListener("change", (event) => {
      state.category = String(event.target.value || "all");
      refresh();
    });
  }

  async function init() {
    try {
      const payload = await loadPayload();
      state.title = payload.title || state.title;
      state.description = payload.description || "";
      state.generatedAt = payload.generatedAt || "";
      state.source = payload.source || state.source;
      state.items = sortItems(Array.isArray(payload.items) ? payload.items : []);

      renderStats();
      renderCategoryOptions();
      bindEvents();
      refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      el.resultMeta.textContent = `Failed to load investigation data: ${message}`;
      el.emptyState.hidden = false;
    }
  }

  init();
})();
