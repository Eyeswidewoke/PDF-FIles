(() => {
  "use strict";

  const ESTIMATED_RELEASE_IMAGES = "~1.2 million";

  const COMPOSITION_NOTES = {
    DS1: "Small extracted release package used in completed small-dataset person scans.",
    DS2: "Small extracted release package used in completed small-dataset person scans.",
    DS3: "Small extracted release package used in completed small-dataset person scans.",
    DS4: "Small extracted release package used in completed small-dataset person scans.",
    DS5: "Small extracted release package used in completed small-dataset person scans.",
    DS6: "Small extracted release package used in completed small-dataset person scans.",
    DS7: "Small extracted release package used in completed small-dataset person scans.",
    DS8: "Mid-size release package with strong person-hit density in scan results.",
    DS9: "Largest public corpus; broad legal and case record language profile. Existing12 scan currently running.",
    DS10: "Large financial-heavy corpus by keyword profile (account, bank, trust, payment).",
    DS11: "Core email-heavy corpus (331k+ PDFs) used for the primary named-person scan pass.",
    DS12: "Small supplemental extracted package used in completed small-dataset person scans.",
  };

  const KEYWORD_SIGNALS = {
    DS9: "Top signals: Epstein, plea, New York, account, flight.",
    DS10: "Top signals: account, bank, Epstein, trust, payment.",
    DS11: "Top signals: plea, flight, New York, Paris, account.",
  };

  const SCAN_STATUS = {
    DS1: "Existing12 complete",
    DS2: "Existing12 complete",
    DS3: "Existing12 complete",
    DS4: "Existing12 complete",
    DS5: "Existing12 complete",
    DS6: "Existing12 complete",
    DS7: "Existing12 complete",
    DS8: "Existing12 complete",
    DS9: "Existing12 in progress",
    DS10: "Financial scan complete",
    DS11: "11/12 complete (Maxwell gap in historical run)",
    DS12: "Existing12 complete",
  };

  const FALLBACK_DATASETS = [
    { dataset: "DS1", individual_files: "3,163", estimated_size: "1.24 GB", links: [{ label: "DOJ", url: "https://www.justice.gov/epstein/files/DataSet%201.zip" }] },
    { dataset: "DS2", individual_files: "577", estimated_size: "0.62 GB", links: [{ label: "DOJ", url: "https://www.justice.gov/epstein/files/DataSet%202.zip" }] },
    { dataset: "DS3", individual_files: "69", estimated_size: "0.59 GB", links: [{ label: "DOJ", url: "https://www.justice.gov/epstein/files/DataSet%203.zip" }] },
    { dataset: "DS4", individual_files: "154", estimated_size: "0.35 GB", links: [{ label: "DOJ", url: "https://www.justice.gov/epstein/files/DataSet%204.zip" }] },
    { dataset: "DS5", individual_files: "122", estimated_size: "0.06 GB", links: [{ label: "DOJ", url: "https://www.justice.gov/epstein/files/DataSet%205.zip" }] },
    { dataset: "DS6", individual_files: "15", estimated_size: "0.05 GB", links: [{ label: "DOJ", url: "https://www.justice.gov/epstein/files/DataSet%206.zip" }] },
    { dataset: "DS7", individual_files: "19", estimated_size: "0.10 GB", links: [{ label: "DOJ", url: "https://www.justice.gov/epstein/files/DataSet%207.zip" }] },
    { dataset: "DS8", individual_files: "-", estimated_size: "1.65 GB", links: [{ label: "DOJ", url: "https://www.justice.gov/epstein/files/DataSet%208.zip" }] },
    { dataset: "DS9", individual_files: "-", estimated_size: "~137.9 GB", links: [{ label: "DOJ", url: "https://www.justice.gov/epstein/files/DataSet%209.zip" }] },
    { dataset: "DS10", individual_files: "-", estimated_size: "~78.6 GB", links: [{ label: "DOJ", url: "https://www.justice.gov/epstein/files/DataSet%2010.zip" }] },
    { dataset: "DS11", individual_files: "331,661", estimated_size: "~25.6 GB", links: [{ label: "DOJ", url: "https://www.justice.gov/epstein/files/DataSet%2011.zip" }] },
    { dataset: "DS12", individual_files: "154", estimated_size: "0.12 GB", links: [{ label: "DOJ", url: "https://www.justice.gov/epstein/files/DataSet%2012.zip" }] },
  ];

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function parseFileCount(rawValue) {
    const digits = String(rawValue || "").replace(/[^\d]/g, "");
    if (!digits) return null;
    const parsed = Number(digits);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function numberFmt(value) {
    return Number(value || 0).toLocaleString("en-US");
  }

  function datasetNumber(datasetLabel) {
    const parsed = Number(String(datasetLabel || "").replace(/[^\d]/g, ""));
    return Number.isFinite(parsed) ? parsed : Number.MAX_SAFE_INTEGER;
  }

  function findLinkByLabel(links, pattern) {
    return (Array.isArray(links) ? links : []).find((entry) => pattern.test(String(entry.label || ""))) || null;
  }

  function deriveOfficialName(datasetLabel, links) {
    const dojLink = findLinkByLabel(links, /doj/i);
    if (dojLink && dojLink.url) {
      const raw = String(dojLink.url).split("/").pop() || "";
      const decoded = decodeURIComponent(raw).trim();
      if (decoded) return decoded;
    }
    const dsNum = String(datasetLabel || "").replace(/[^\d]/g, "");
    return dsNum ? `DataSet ${dsNum}.zip` : "Dataset";
  }

  function buildSummary(datasets) {
    const summaryEl = document.getElementById("releaseSummary");
    if (!summaryEl) return;

    const knownFileTotal = datasets.reduce((acc, row) => acc + (parseFileCount(row.individual_files) || 0), 0);
    const knownFileDatasets = datasets.filter((row) => parseFileCount(row.individual_files) != null).length;
    const heavyDatasets = datasets.filter((row) => {
      const num = datasetNumber(row.dataset);
      return num === 9 || num === 10 || num === 11;
    }).length;
    const extractedCount = datasets.filter((row) =>
      String(row.status || "").toLowerCase().includes("extract")
    ).length;

    const cards = [
      { label: "Official Datasets", value: numberFmt(datasets.length) },
      { label: "Known File Count", value: `${numberFmt(knownFileTotal)} (from ${knownFileDatasets} datasets)` },
      { label: "Heavy Corpora", value: `${numberFmt(heavyDatasets)} (DS9, DS10, DS11)` },
      { label: "Estimated Pictures (Release)", value: `${ESTIMATED_RELEASE_IMAGES} (approx)` },
      { label: "Marked Extracted", value: numberFmt(extractedCount) },
      { label: "Current DS9 Work", value: "Existing12 in progress" },
    ];

    summaryEl.innerHTML = cards
      .map(
        (card) => `
          <article class="stat-card">
            <div class="label">${escapeHtml(card.label)}</div>
            <div class="value">${escapeHtml(card.value)}</div>
          </article>
        `
      )
      .join("");
  }

  function buildRows(datasets) {
    const rowsEl = document.getElementById("releaseRows");
    if (!rowsEl) return;

    const ordered = [...datasets].sort((a, b) => datasetNumber(a.dataset) - datasetNumber(b.dataset));
    rowsEl.innerHTML = ordered
      .map((row) => {
        const datasetLabel = String(row.dataset || "Dataset");
        const dsNum = datasetNumber(datasetLabel);
        const dsPage = Number.isFinite(dsNum) && dsNum < Number.MAX_SAFE_INTEGER ? `./ds${dsNum}.html` : "";
        const links = Array.isArray(row.links) ? row.links : [];
        const officialName = deriveOfficialName(datasetLabel, links);
        const files = row.individual_files || "-";
        const size = row.estimated_size || "-";
        const note = COMPOSITION_NOTES[datasetLabel] || "Mixed release package in current public bundle.";
        const signals = KEYWORD_SIGNALS[datasetLabel] || "";
        const status = SCAN_STATUS[datasetLabel] || "Status pending";
        const statusLine = `Scan status: ${status}.`;

        const pills = [];
        if (dsPage) pills.push(`<a class="release-link-pill" href="${escapeHtml(dsPage)}">DS Page</a>`);

        const doj = findLinkByLabel(links, /^doj$/i) || findLinkByLabel(links, /doj/i);
        const archiveZip = findLinkByLabel(links, /archive\s*zip/i) || findLinkByLabel(links, /^archive$/i);
        const archiveItem = findLinkByLabel(links, /archive\s*item|archive\s*details/i);
        const torrent = findLinkByLabel(links, /torrent|magnet/i);

        if (doj && doj.url) {
          pills.push(`<a class="release-link-pill" href="${escapeHtml(doj.url)}" target="_blank" rel="noopener noreferrer">DOJ ZIP</a>`);
        }
        if (archiveZip && archiveZip.url) {
          pills.push(`<a class="release-link-pill" href="${escapeHtml(archiveZip.url)}" target="_blank" rel="noopener noreferrer">Archive ZIP</a>`);
        }
        if (archiveItem && archiveItem.url) {
          pills.push(`<a class="release-link-pill" href="${escapeHtml(archiveItem.url)}" target="_blank" rel="noopener noreferrer">Archive Item</a>`);
        }
        if (torrent && torrent.url) {
          pills.push(`<a class="release-link-pill" href="${escapeHtml(torrent.url)}" target="_blank" rel="noopener noreferrer">Torrent</a>`);
        }

        return `
          <tr>
            <td>
              <strong>${escapeHtml(datasetLabel)}</strong>
              <span class="release-zip">${escapeHtml(row.status || "")}</span>
            </td>
            <td>
              <strong>${escapeHtml(officialName)}</strong>
              <span class="release-zip">${escapeHtml(size)}</span>
            </td>
            <td>${escapeHtml(files)}</td>
            <td>
              <p class="release-note">${escapeHtml(note)}</p>
              <p class="release-note">${escapeHtml(statusLine)}</p>
              ${signals ? `<p class="release-note">${escapeHtml(signals)}</p>` : ""}
            </td>
            <td><div class="release-links">${pills.join("")}</div></td>
          </tr>
        `;
      })
      .join("");
  }

  async function loadDatasets() {
    try {
      const response = await fetch("./data/public-data.json", { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      if (!payload || !Array.isArray(payload.datasets) || !payload.datasets.length) {
        throw new Error("No datasets array in payload");
      }
      return payload.datasets;
    } catch (_) {
      return FALLBACK_DATASETS;
    }
  }

  async function init() {
    const datasets = await loadDatasets();
    buildSummary(datasets);
    buildRows(datasets);
  }

  init();
})();
