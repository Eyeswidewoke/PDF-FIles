(() => {
  "use strict";

  const META_URL = "./data/dataset-file-index/dataset-index.json";
  const DATA_BASE = "./data/dataset-file-index/";
  const DEFAULT_PAGE_SIZE = 500;

  const cache = new Map();

  const state = {
    meta: null,
    activeDataset: null,
    lines: [],
    filteredIndexes: null,
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  };

  const elements = {
    summaryCards: document.getElementById("datasetSummaryCards"),
    datasetCards: document.getElementById("datasetCards"),
    viewerTitle: document.getElementById("viewerTitle"),
    viewerMeta: document.getElementById("viewerMeta"),
    viewerActions: document.getElementById("viewerActions"),
    downloadTxt: document.getElementById("downloadTxt"),
    downloadCsv: document.getElementById("downloadCsv"),
    filenameFilter: document.getElementById("filenameFilter"),
    pageSize: document.getElementById("pageSize"),
    applyFilter: document.getElementById("applyFilter"),
    clearFilter: document.getElementById("clearFilter"),
    viewerStatus: document.getElementById("viewerStatus"),
    fileRows: document.getElementById("fileRows"),
    paginationInfo: document.getElementById("paginationInfo"),
    prevPage: document.getElementById("prevPage"),
    nextPage: document.getElementById("nextPage"),
    pageInput: document.getElementById("pageInput"),
    jumpPage: document.getElementById("jumpPage"),
  };

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatNumber(value) {
    const num = Number(value || 0);
    return Number.isFinite(num) ? num.toLocaleString("en-US") : "0";
  }

  function setStatus(message) {
    if (!elements.viewerStatus) return;
    elements.viewerStatus.textContent = message || "";
  }

  function getDatasetById(id) {
    if (!state.meta || !Array.isArray(state.meta.datasets)) return null;
    return state.meta.datasets.find((row) => String(row.id || "").toUpperCase() === String(id || "").toUpperCase()) || null;
  }

  function getDownloadRange(datasets) {
    const dates = datasets
      .map((dataset) => String(dataset.downloaded_date || "").trim())
      .filter(Boolean)
      .sort();
    if (!dates.length) return "Unknown";
    if (dates[0] === dates[dates.length - 1]) return dates[0];
    return `${dates[0]} to ${dates[dates.length - 1]}`;
  }

  function renderSummary(meta) {
    if (!elements.summaryCards) return;
    const datasets = Array.isArray(meta.datasets) ? meta.datasets : [];
    const totalDatasets = datasets.length;
    const totalFiles = formatNumber(meta.total_files || 0);
    const downloadRange = getDownloadRange(datasets);
    const generatedAt = meta.inventory_index_generated || meta.generated_at || "Unknown";

    elements.summaryCards.innerHTML = [
      `<article class="dataset-meta-card"><p class="dataset-meta-label">Datasets</p><p class="dataset-meta-value">${formatNumber(totalDatasets)}</p></article>`,
      `<article class="dataset-meta-card"><p class="dataset-meta-label">Total Files Indexed</p><p class="dataset-meta-value">${totalFiles}</p></article>`,
      `<article class="dataset-meta-card"><p class="dataset-meta-label">Local Download Window</p><p class="dataset-meta-value">${escapeHtml(downloadRange)}</p></article>`,
      `<article class="dataset-meta-card"><p class="dataset-meta-label">Inventory Built</p><p class="dataset-meta-value">${escapeHtml(String(generatedAt))}</p></article>`,
    ].join("\n");
  }

  function renderDatasetCards(meta) {
    if (!elements.datasetCards) return;
    const datasets = Array.isArray(meta.datasets) ? meta.datasets : [];
    elements.datasetCards.innerHTML = datasets
      .map((dataset) => {
        const id = escapeHtml(dataset.id || "");
        const count = formatNumber(dataset.file_count || 0);
        const date = escapeHtml(dataset.downloaded_label || dataset.downloaded_date || "Unknown");
        return [
          `<button class="dataset-select-card" type="button" role="option" aria-selected="false" data-ds="${id}">`,
          `  <span class="dataset-select-id">${id}</span>`,
          `  <span class="dataset-select-count">${count} files</span>`,
          `  <span class="dataset-select-date">Downloaded: ${date}</span>`,
          `</button>`,
        ].join("\n");
      })
      .join("\n");
  }

  function updateCardSelection() {
    if (!elements.datasetCards) return;
    const selectedId = state.activeDataset ? String(state.activeDataset.id || "") : "";
    const buttons = elements.datasetCards.querySelectorAll("[data-ds]");
    buttons.forEach((button) => {
      const isActive = String(button.getAttribute("data-ds") || "") === selectedId;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-selected", isActive ? "true" : "false");
    });
  }

  function totalVisibleRows() {
    return Array.isArray(state.filteredIndexes) ? state.filteredIndexes.length : state.lines.length;
  }

  function totalPages() {
    const rows = totalVisibleRows();
    return Math.max(1, Math.ceil(rows / Math.max(1, state.pageSize)));
  }

  function clampPage() {
    const pages = totalPages();
    if (state.page < 1) state.page = 1;
    if (state.page > pages) state.page = pages;
  }

  function rowForPosition(position) {
    if (Array.isArray(state.filteredIndexes)) {
      const sourceIndex = state.filteredIndexes[position];
      return {
        rowNumber: sourceIndex + 1,
        filename: state.lines[sourceIndex] || "",
      };
    }
    return {
      rowNumber: position + 1,
      filename: state.lines[position] || "",
    };
  }

  function renderRows() {
    if (!elements.fileRows) return;

    const rows = totalVisibleRows();
    clampPage();

    if (!state.activeDataset) {
      elements.fileRows.innerHTML = `<tr><td colspan="2"><p class="dataset-file-empty">Select a dataset above to load filenames.</p></td></tr>`;
      if (elements.paginationInfo) elements.paginationInfo.textContent = "Rows 0-0 of 0";
      if (elements.prevPage) elements.prevPage.disabled = true;
      if (elements.nextPage) elements.nextPage.disabled = true;
      return;
    }

    if (!rows) {
      elements.fileRows.innerHTML = `<tr><td colspan="2"><p class="dataset-file-empty">No filenames match the current filter.</p></td></tr>`;
      if (elements.paginationInfo) {
        elements.paginationInfo.textContent = `Rows 0-0 of 0 (Page 1/${totalPages()})`;
      }
      if (elements.prevPage) elements.prevPage.disabled = true;
      if (elements.nextPage) elements.nextPage.disabled = true;
      if (elements.pageInput) {
        elements.pageInput.value = "1";
        elements.pageInput.max = "1";
      }
      return;
    }

    const start = (state.page - 1) * state.pageSize;
    const end = Math.min(start + state.pageSize, rows);
    const output = [];

    for (let i = start; i < end; i += 1) {
      const row = rowForPosition(i);
      output.push(`<tr><td>${formatNumber(row.rowNumber)}</td><td>${escapeHtml(row.filename)}</td></tr>`);
    }

    elements.fileRows.innerHTML = output.join("\n");

    const pages = totalPages();
    if (elements.paginationInfo) {
      elements.paginationInfo.textContent = `Rows ${formatNumber(start + 1)}-${formatNumber(end)} of ${formatNumber(rows)} (Page ${formatNumber(state.page)}/${formatNumber(pages)})`;
    }

    if (elements.pageInput) {
      elements.pageInput.value = String(state.page);
      elements.pageInput.max = String(pages);
    }

    if (elements.prevPage) elements.prevPage.disabled = state.page <= 1;
    if (elements.nextPage) elements.nextPage.disabled = state.page >= pages;
  }

  function updateViewerHead(dataset) {
    if (!dataset) return;

    if (elements.viewerTitle) {
      elements.viewerTitle.textContent = `${dataset.id} Filename Inventory`;
    }

    if (elements.viewerMeta) {
      const lines = [
        `${formatNumber(dataset.file_count || 0)} files`,
        `Downloaded: ${dataset.downloaded_label || dataset.downloaded_date || "Unknown"}`,
        `List file: ${dataset.list_txt || "Unknown"}`,
      ];
      elements.viewerMeta.textContent = lines.join(" | ");
    }

    const txtHref = `${DATA_BASE}${dataset.list_txt}`;
    const csvHref = `${DATA_BASE}${dataset.list_csv}`;

    if (elements.downloadTxt) elements.downloadTxt.href = txtHref;
    if (elements.downloadCsv) elements.downloadCsv.href = csvHref;
    if (elements.viewerActions) elements.viewerActions.hidden = false;
  }

  function syncUrl(datasetId) {
    const url = new URL(window.location.href);
    url.searchParams.set("ds", datasetId);
    window.history.replaceState(null, "", url.toString());
  }

  async function loadDatasetLines(dataset) {
    if (cache.has(dataset.id)) return cache.get(dataset.id);
    const response = await fetch(`${DATA_BASE}${dataset.list_txt}`);
    if (!response.ok) {
      throw new Error(`Failed to load ${dataset.list_txt} (${response.status})`);
    }
    const text = await response.text();
    const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    cache.set(dataset.id, lines);
    return lines;
  }

  async function selectDataset(datasetId, updateUrl) {
    const dataset = getDatasetById(datasetId);
    if (!dataset) return;

    state.activeDataset = dataset;
    state.page = 1;
    state.filteredIndexes = null;

    if (elements.filenameFilter) elements.filenameFilter.value = "";

    updateCardSelection();
    updateViewerHead(dataset);

    if (elements.fileRows) {
      elements.fileRows.innerHTML = `<tr><td colspan="2"><p class="dataset-file-empty">Loading ${escapeHtml(dataset.list_txt)}...</p></td></tr>`;
    }

    setStatus(`Loading ${dataset.id} list...`);

    try {
      state.lines = await loadDatasetLines(dataset);
      setStatus(`Loaded ${formatNumber(state.lines.length)} filenames from ${dataset.list_txt}.`);
      renderRows();
      if (updateUrl) syncUrl(dataset.id);
    } catch (error) {
      state.lines = [];
      renderRows();
      setStatus(`Error loading dataset list: ${error && error.message ? error.message : "Unknown error"}`);
    }
  }

  function runFilter() {
    if (!state.activeDataset) return;

    const query = String((elements.filenameFilter && elements.filenameFilter.value) || "").trim().toLowerCase();
    const started = window.performance && typeof window.performance.now === "function" ? window.performance.now() : Date.now();

    if (!query) {
      state.filteredIndexes = null;
      state.page = 1;
      setStatus(`Showing all ${formatNumber(state.lines.length)} filenames in ${state.activeDataset.id}.`);
      renderRows();
      return;
    }

    const matches = [];
    for (let i = 0; i < state.lines.length; i += 1) {
      if (String(state.lines[i] || "").toLowerCase().indexOf(query) !== -1) {
        matches.push(i);
      }
    }

    const ended = window.performance && typeof window.performance.now === "function" ? window.performance.now() : Date.now();
    state.filteredIndexes = matches;
    state.page = 1;
    renderRows();
    setStatus(`Filter \"${query}\" matched ${formatNumber(matches.length)} filenames (${Math.round(ended - started)} ms).`);
  }

  function clearFilter() {
    if (elements.filenameFilter) elements.filenameFilter.value = "";
    state.filteredIndexes = null;
    state.page = 1;
    renderRows();
    if (state.activeDataset) {
      setStatus(`Showing all ${formatNumber(state.lines.length)} filenames in ${state.activeDataset.id}.`);
    }
  }

  function bindEvents() {
    if (elements.datasetCards) {
      elements.datasetCards.addEventListener("click", (event) => {
        const target = event.target instanceof Element ? event.target.closest("[data-ds]") : null;
        if (!target) return;
        const datasetId = target.getAttribute("data-ds");
        if (!datasetId) return;
        selectDataset(datasetId, true);
      });
    }

    if (elements.applyFilter) {
      elements.applyFilter.addEventListener("click", runFilter);
    }

    if (elements.clearFilter) {
      elements.clearFilter.addEventListener("click", clearFilter);
    }

    if (elements.filenameFilter) {
      let timer = null;
      elements.filenameFilter.addEventListener("input", () => {
        if (timer) window.clearTimeout(timer);
        timer = window.setTimeout(() => {
          runFilter();
        }, 220);
      });
      elements.filenameFilter.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          runFilter();
        }
      });
    }

    if (elements.pageSize) {
      elements.pageSize.addEventListener("change", () => {
        const next = Number(elements.pageSize.value);
        state.pageSize = Number.isFinite(next) && next > 0 ? next : DEFAULT_PAGE_SIZE;
        state.page = 1;
        renderRows();
      });
    }

    if (elements.prevPage) {
      elements.prevPage.addEventListener("click", () => {
        state.page -= 1;
        renderRows();
      });
    }

    if (elements.nextPage) {
      elements.nextPage.addEventListener("click", () => {
        state.page += 1;
        renderRows();
      });
    }

    if (elements.jumpPage) {
      elements.jumpPage.addEventListener("click", () => {
        const requested = Number(elements.pageInput ? elements.pageInput.value : state.page);
        if (!Number.isFinite(requested)) return;
        state.page = Math.max(1, Math.floor(requested));
        renderRows();
      });
    }

    if (elements.pageInput) {
      elements.pageInput.addEventListener("keydown", (event) => {
        if (event.key !== "Enter") return;
        event.preventDefault();
        const requested = Number(elements.pageInput.value);
        if (!Number.isFinite(requested)) return;
        state.page = Math.max(1, Math.floor(requested));
        renderRows();
      });
    }
  }

  function pickInitialDataset(meta) {
    const datasets = Array.isArray(meta.datasets) ? meta.datasets : [];
    if (!datasets.length) return "";

    const query = new URLSearchParams(window.location.search);
    const requested = String(query.get("ds") || "").toUpperCase();
    if (!requested) return String(datasets[0].id || "");

    const valid = datasets.find((dataset) => String(dataset.id || "").toUpperCase() === requested);
    return valid ? String(valid.id || "") : String(datasets[0].id || "");
  }

  async function loadMeta() {
    const response = await fetch(META_URL);
    if (!response.ok) {
      throw new Error(`Failed to load metadata (${response.status})`);
    }
    return response.json();
  }

  async function init() {
    bindEvents();
    setStatus("Loading dataset metadata...");

    try {
      const meta = await loadMeta();
      state.meta = meta;
      renderSummary(meta);
      renderDatasetCards(meta);

      const initialDatasetId = pickInitialDataset(meta);
      if (!initialDatasetId) {
        setStatus("No datasets were found in metadata.");
        return;
      }

      await selectDataset(initialDatasetId, true);
    } catch (error) {
      setStatus(`Unable to load dataset index: ${error && error.message ? error.message : "Unknown error"}`);
      if (elements.datasetCards) {
        elements.datasetCards.innerHTML = `<p class=\"dataset-file-empty\">Dataset index failed to load for this build.</p>`;
      }
    }
  }

  init();
})();
