(() => {
  "use strict";

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function escapeAttr(value) {
    return String(value ?? "").replace(/"/g, "&quot;");
  }

  function inferDatasetFromPath() {
    const match = String(window.location.pathname || "").match(/ds(\d+)\.html$/i);
    if (!match) return "";
    return `DS${Number(match[1])}`;
  }

  function statusBadge(statusValue) {
    const status = String(statusValue || "");
    const lower = status.toLowerCase();
    if (lower.includes("extract")) return { className: "extracted", label: "Extracted" };
    if (lower.includes("download")) return { className: "downloading", label: "Downloading" };
    if (lower.includes("combined")) return { className: "combined", label: "Combined" };
    return { className: "", label: status || "Unknown" };
  }

  function deriveOfficialName(datasetLabel, links) {
    const dojLink = links.find((link) => /doj/i.test(String(link.label || "")));
    if (dojLink && dojLink.url) {
      const rawName = String(dojLink.url).split("/").pop() || "";
      const decoded = decodeURIComponent(rawName).trim();
      if (decoded) return decoded;
    }
    const dsNum = String(datasetLabel || "").replace(/\D/g, "");
    return dsNum ? `DataSet ${dsNum}.zip` : "Dataset";
  }

  async function loadPayload() {
    if (window.TRUMP_FILES_DATA) return window.TRUMP_FILES_DATA;
    if (window.EVIDENCE_ATLAS_DATA) return window.EVIDENCE_ATLAS_DATA;
    const response = await fetch("./data/public-data.json");
    if (!response.ok) throw new Error(`Failed to load data (${response.status})`);
    return response.json();
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function showLink(id, href) {
    const el = document.getElementById(id);
    if (!el) return;
    if (!href) {
      el.hidden = true;
      return;
    }
    el.href = href;
    el.hidden = false;
  }

  function renderNotFound(datasetId) {
    const card = document.getElementById("datasetCard");
    if (!card) return;
    setText("datasetTitle", datasetId || "Dataset");
    setText("datasetHeading", datasetId || "Dataset");
    setText("datasetSubhead", "Dataset record not found in public-data.json for this build.");
    card.innerHTML = `<p class="dataset-empty">No dataset details were found for ${escapeHtml(datasetId || "this page")}.</p>`;
    const refs = document.getElementById("datasetSiteLinks");
    if (refs) refs.innerHTML = "";
  }

  function renderDataset(dataset) {
    const datasetId = String(dataset.dataset || "Dataset");
    const links = Array.isArray(dataset.links) ? dataset.links : [];
    const siteLinks = Array.isArray(dataset.site_links) ? dataset.site_links : [];
    const badge = statusBadge(dataset.status);
    const officialName = deriveOfficialName(datasetId, links);

    document.title = `${datasetId} | THE PDF FILES`;
    setText("datasetTitle", datasetId);
    setText("datasetHeading", `${datasetId} Details`);
    setText("datasetSubhead", `${officialName} • ${dataset.individual_files || "—"} files • ${dataset.estimated_size || "—"}`);

    const dojHref = String((links.find((link) => /doj/i.test(String(link.label || ""))) || {}).url || "");
    const archiveHref = String((links.find((link) => /archive/i.test(String(link.label || ""))) || {}).url || "");
    showLink("dojNavLink", dojHref);
    showLink("archiveNavLink", archiveHref);

    const officialLinksHtml = links
      .map((link) => {
        const label = escapeHtml(link.label || "Link");
        const url = escapeAttr(link.url || "#");
        return `<a class="ds-link-btn" href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
      })
      .join("");

    const card = document.getElementById("datasetCard");
    if (card) {
      card.innerHTML = [
        `<div class="ds-head">`,
        `  <div class="ds-title-wrap">`,
        `    <span class="ds-title-link">`,
        `      <span class="ds-name">${escapeHtml(datasetId)}</span>`,
        `      <span class="ds-official-name">${escapeHtml(officialName)}</span>`,
        `    </span>`,
        `  </div>`,
        `  <span class="ds-badge ${badge.className}">${escapeHtml(badge.label)}</span>`,
        `</div>`,
        `<div class="ds-row">`,
        `  <div class="ds-stats">`,
        `    <span>📄 ${escapeHtml(dataset.individual_files || "—")} files</span>`,
        `    <span>💾 ${escapeHtml(dataset.estimated_size || "—")}</span>`,
        `  </div>`,
        `  <div class="ds-actions">`,
        officialLinksHtml ? `    <div class="ds-links">${officialLinksHtml}</div>` : "",
        `  </div>`,
        `</div>`,
      ].join("\n");
    }

    const refs = document.getElementById("datasetSiteLinks");
    if (!refs) return;
    if (!siteLinks.length) {
      refs.innerHTML = `<p class="dataset-empty">No bundle reference links are listed for this dataset.</p>`;
      return;
    }

    refs.innerHTML = siteLinks
      .map((entry) => {
        const label = escapeHtml(entry.label || "Reference");
        const rawPath = String(entry.path || "").replace(/^\.?\//, "");
        if (!rawPath) {
          return `<span class="dataset-ref-pill">${label}</span>`;
        }
        const href = `./${escapeAttr(rawPath)}`;
        return `<a class="dataset-ref-pill" href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`;
      })
      .join("");
  }

  async function init() {
    const qs = new URLSearchParams(window.location.search);
    const requested = String(qs.get("dataset") || qs.get("ds") || inferDatasetFromPath()).toUpperCase();
    if (!requested) {
      renderNotFound("Dataset");
      return;
    }

    try {
      const payload = await loadPayload();
      const dataset = (payload.datasets || []).find((row) => String(row.dataset || "").toUpperCase() === requested);
      if (!dataset) {
        renderNotFound(requested);
        return;
      }
      renderDataset(dataset);
    } catch (error) {
      setText("datasetTitle", requested);
      setText("datasetHeading", `${requested} Details`);
      setText("datasetSubhead", "Unable to load dataset metadata for this build.");
      const card = document.getElementById("datasetCard");
      if (card) {
        card.innerHTML = `<p class="dataset-empty">Error loading dataset metadata: ${escapeHtml(error && error.message ? error.message : "Unknown error")}</p>`;
      }
    }
  }

  init();
})();
