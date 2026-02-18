(function () {
  const SVG_NS = "http://www.w3.org/2000/svg";
  const MAP_W = 980;
  const MAP_H = 460;
  const MAX_TEXT_VIEWER_CHARS = 350000;
  const TEXT_EXTS = new Set([
    ".md",
    ".txt",
    ".json",
    ".jsonl",
    ".tsv",
    ".csv",
    ".log",
    ".xml",
    ".html",
    ".js",
    ".py",
    ".ps1",
  ]);
  const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp", ".jp2", ".tif", ".tiff"]);

  const el = {
    generatedAt: document.getElementById("generatedAt"),
    rootPath: document.getElementById("rootPath"),
    statCards: document.getElementById("statCards"),
    datasetGrid: document.getElementById("datasetGrid"),
    searchInput: document.getElementById("searchInput"),
    collectionFilter: document.getElementById("collectionFilter"),
    sourceFilter: document.getElementById("sourceFilter"),
    sortField: document.getElementById("sortField"),
    sortDir: document.getElementById("sortDir"),
    resultMeta: document.getElementById("resultMeta"),
    artifactList: document.getElementById("artifactList"),
    detailLabel: document.getElementById("detailLabel"),
    detailPath: document.getElementById("detailPath"),
    detailCategory: document.getElementById("detailCategory"),
    detailSource: document.getElementById("detailSource"),
    detailSize: document.getElementById("detailSize"),
    detailModified: document.getElementById("detailModified"),
    detailNote: document.getElementById("detailNote"),
    copyPathBtn: document.getElementById("copyPathBtn"),
    openPathBtn: document.getElementById("openPathBtn"),
    viewerPanel: document.getElementById("viewerPanel"),
    viewerTitle: document.getElementById("viewerTitle"),
    viewerMeta: document.getElementById("viewerMeta"),
    viewerMarkdown: document.getElementById("viewerMarkdown"),
    viewerText: document.getElementById("viewerText"),
    viewerImage: document.getElementById("viewerImage"),
    viewerFrame: document.getElementById("viewerFrame"),
    closeViewerBtn: document.getElementById("closeViewerBtn"),
    mindmapSvg: document.getElementById("mindmapSvg"),
    mindmapMeta: document.getElementById("mindmapMeta"),
    clearMapBtn: document.getElementById("clearMapBtn"),
    mapSidebar: document.getElementById("mapSidebar"),
    timelineSearch: document.getElementById("timelineSearch"),
    timelineYearFilter: document.getElementById("timelineYearFilter"),
    timelineMeta: document.getElementById("timelineMeta"),
    timelineList: document.getElementById("timelineList"),
    characterSearch: document.getElementById("characterSearch"),
    characterMeta: document.getElementById("characterMeta"),
    characterList: document.getElementById("characterList"),
  };
  const HAS_MINDMAP = Boolean(el.mindmapSvg);

  const state = {
    payload: null,
    flattened: [],
    filtered: [],
    selected: null,
    query: "",
    collection: "all",
    source: "all",
    sortField: "modified",
    sortDir: "desc",
    mapSelectedId: null,
    map: null,
    viewerToken: 0,
    viewerPath: null,
    openUrl: null,
    timelineAll: [],
    timelineFiltered: [],
    timelineQuery: "",
    timelineYear: "all",
    characterAll: [],
    characterFiltered: [],
    characterQuery: "",
  };

  const MAP_KEY_META = {
    epstein: { label: "Epstein Corpus", type: "hub" },
    datasets: { label: "Datasets", type: "dataset" },
    emails: { label: "Email Corpus", type: "thread" },
    images: { label: "Images", type: "image" },
    topics: { label: "Topics", type: "topic" },
    cast: { label: "Cast", type: "person" },
    threads: { label: "Email Threads", type: "thread" },
    barr: { label: "Barr", type: "person" },
    clip: { label: "CLIP", type: "ai" },
    inventory: { label: "Inventory", type: "doc" },
    index: { label: "Indexes", type: "doc" },
    verification: { label: "Verification", type: "topic" },
    pipeline: { label: "Pipeline", type: "ai" },
    characters: { label: "Characters", type: "person" },
    timeline: { label: "Timeline", type: "timeline" },
  };

  function normalizePath(value) {
    return String(value || "").replace(/\\/g, "/").toLowerCase();
  }

  function labelFromKey(key) {
    const value = String(key || "").trim();
    if (!value) return "Node";
    const known = MAP_KEY_META[value];
    if (known && known.label) return known.label;
    return value
      .split(/[-_:/]+/)
      .map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1) : ""))
      .join(" ");
  }

  function incrementMapCount(map, key, delta = 1) {
    map.set(key, (map.get(key) || 0) + delta);
  }

  function isCollectionNodeId(value) {
    return String(value || "").startsWith("collection:");
  }

  function collectionIdFromNodeId(value) {
    if (!isCollectionNodeId(value)) return null;
    return String(value || "").slice("collection:".length);
  }

  function isHiddenArtifact(item) {
    if (!item) return false;
    const path = normalizePath(item.path || "");
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

  function createPlaceholderPayload() {
    return {
      generated_at: "Scaffold mode (no import)",
      paths: {
        source: "public-release-bundle",
      },
      stats: {
        included_collections: null,
        included_artifacts: null,
        indexed_timeline_events: null,
        included_email_files: null,
        included_image_files: null,
        included_cast_profiles: null,
        included_cast_pages: null,
        included_sources: null,
      },
      datasets: [
        {
          dataset: "DS1",
          status: "Public release",
          individual_files: "3,158",
          estimated_size: "1.24 GB",
          links: [{ label: "DOJ", url: "https://www.justice.gov/epstein/files/DataSet%201.zip" }],
        },
        {
          dataset: "DS9",
          status: "Public release",
          individual_files: "252,169",
          estimated_size: "~138 GB",
          links: [{ label: "DOJ", url: "https://www.justice.gov/epstein/files/DataSet%209.zip" }],
        },
        {
          dataset: "DS11",
          status: "Public release",
          individual_files: "331,655",
          estimated_size: "25.6 GB",
          links: [{ label: "DOJ", url: "https://www.justice.gov/epstein/files/DataSet%2011.zip" }],
        },
      ],
      collections: [
        {
          id: "core-docs",
          title: "Core Docs",
          items: [
            {
              label: "FILE-INVENTORY.md",
              path: "content/docs/epstein/FILE-INVENTORY.md",
              source: "repo",
              category: "inventory",
              size_bytes: null,
              modified: null,
              note: "Master physical inventory.",
              map_keys: ["datasets", "inventory", "epstein"],
            },
            {
              label: "MASTER-INDEX.md",
              path: "content/docs/epstein/MASTER-INDEX.md",
              source: "repo",
              category: "index",
              size_bytes: null,
              modified: null,
              note: "Keyword matrix and dataset ranges.",
              map_keys: ["datasets", "topics", "index"],
            },
          ],
        },
        {
          id: "email-threads",
          title: "Email Threads",
          items: [
            {
              label: "EMAIL-INDEX.md",
              path: "content/emails/indexes/EMAIL-INDEX.md",
              source: "repo",
              category: "email-index",
              size_bytes: null,
              modified: null,
              note: "Overview of extracted email corpus.",
              map_keys: ["emails", "threads", "index"],
            },
            {
              label: "CAST-EMAIL-INDEX.md",
              path: "content/emails/indexes/CAST-EMAIL-INDEX.md",
              source: "repo",
              category: "email-index",
              size_bytes: null,
              modified: null,
              note: "Emails grouped by cast entities.",
              map_keys: ["emails", "threads", "cast", "characters"],
            },
            {
              label: "BARR-EMAIL-ANALYSIS.md",
              path: "content/emails/barr/BARR-EMAIL-ANALYSIS.md",
              source: "repo",
              category: "analysis",
              size_bytes: null,
              modified: null,
              note: "Named thread analysis sample.",
              map_keys: ["emails", "threads", "barr", "cast"],
            },
          ],
        },
        {
          id: "pipeline",
          title: "Pipeline Artifacts",
          items: [
            {
              label: "_extract_all_pending_run3.log",
              path: "content/pipeline/_extract_all_pending_run3.log",
              source: "release",
              category: "log",
              size_bytes: null,
              modified: null,
              note: "Live extraction run log.",
              map_keys: ["images", "datasets", "pipeline"],
            },
            {
              label: "clip_tag_run.log",
              path: "content/pipeline/clip_tag_run.log",
              source: "release",
              category: "log",
              size_bytes: null,
              modified: null,
              note: "CLIP queue state.",
              map_keys: ["images", "pipeline", "clip"],
            },
            {
              label: "clip_tags.jsonl (planned)",
              path: "content/pipeline/clip_tags.jsonl",
              source: "release",
              category: "ai-tags",
              size_bytes: null,
              modified: null,
              note: "Target path for semantic image tags.",
              map_keys: ["images", "clip", "topics"],
            },
          ],
        },
      ],
      graph: {
        nodes: [
          { id: "epstein", label: "Epstein Corpus", type: "hub" },
          { id: "datasets", label: "Datasets", type: "dataset" },
          { id: "emails", label: "Email Corpus", type: "thread" },
          { id: "images", label: "Extracted Images", type: "image" },
          { id: "topics", label: "Topics / Claims", type: "topic" },
          { id: "cast", label: "Cast / Characters", type: "person" },
          { id: "threads", label: "Email Threads", type: "thread" },
          { id: "barr", label: "Barr Thread", type: "person" },
          { id: "clip", label: "CLIP Tags", type: "ai" },
          { id: "inventory", label: "Inventory Docs", type: "doc" },
          { id: "index", label: "Index Docs", type: "doc" },
          { id: "verification", label: "Verification Queue", type: "topic" },
          { id: "pipeline", label: "Processing Pipeline", type: "ai" },
          { id: "characters", label: "Named Entities", type: "person" },
          { id: "timeline", label: "Timeline", type: "timeline" },
        ],
        links: [
          { source: "epstein", target: "datasets", label: "contains" },
          { source: "epstein", target: "emails", label: "contains" },
          { source: "epstein", target: "images", label: "derived" },
          { source: "epstein", target: "topics", label: "analyzed by" },
          { source: "datasets", target: "inventory", label: "indexed in" },
          { source: "datasets", target: "index", label: "indexed in" },
          { source: "emails", target: "threads", label: "organized by" },
          { source: "threads", target: "cast", label: "references" },
          { source: "threads", target: "barr", label: "sample thread" },
          { source: "images", target: "clip", label: "tagged by" },
          { source: "clip", target: "topics", label: "supports" },
          { source: "topics", target: "verification", label: "queued in" },
          { source: "pipeline", target: "images", label: "builds" },
          { source: "pipeline", target: "clip", label: "feeds" },
          { source: "cast", target: "characters", label: "expands" },
          { source: "characters", target: "topics", label: "connected to" },
          { source: "timeline", target: "topics", label: "chronology" },
          { source: "timeline", target: "cast", label: "actors" },
        ],
      },
      timeline: {
        event_count: 3,
        years: [2019, 2020, 2021],
        sources: [
          { label: "2019.md", path: "content/timeline/2019.md", event_count: 1 },
          { label: "2020.md", path: "content/timeline/2020.md", event_count: 1 },
          { label: "2021.md", path: "content/timeline/2021.md", event_count: 1 },
        ],
        events: [
          {
            id: "timeline-demo-001",
            year: 2019,
            date: "December 18, 2019",
            title: "First impeachment vote in House",
            summary: "House votes to impeach on abuse of power and obstruction charges.",
            significance: "Escalated constitutional conflict and Senate trial in early 2020.",
            source_path: "content/timeline/2019.md",
            source_label: "2019.md",
          },
          {
            id: "timeline-demo-002",
            year: 2020,
            date: "November 7, 2020",
            title: "Election called for Biden",
            summary: "Major networks project Joe Biden as election winner.",
            significance: "Triggered broad disinformation campaign about election integrity.",
            source_path: "content/timeline/2020.md",
            source_label: "2020.md",
          },
          {
            id: "timeline-demo-003",
            year: 2021,
            date: "January 6, 2021",
            title: "Capitol attack",
            summary: "Violent attack on Capitol during certification proceedings.",
            significance: "Led to second impeachment and extensive federal investigations.",
            source_path: "content/timeline/2021.md",
            source_label: "2021.md",
          },
        ],
      },
      notes: [
        "Summary reflects only content currently included in this site bundle.",
        "Datasets table uses official public release URLs instead of local disk paths.",
        "Use Timeline Viewer to browse chronology and open timeline source markdown in-site.",
      ],
    };
  }

  function numberFmt(value) {
    if (value == null || Number.isNaN(Number(value))) return "-";
    return Number(value).toLocaleString("en-US");
  }

  function sizeFmt(bytes) {
    if (bytes == null || bytes < 0) return "-";
    const units = ["B", "KB", "MB", "GB", "TB"];
    let value = Number(bytes);
    let idx = 0;
    while (value >= 1024 && idx < units.length - 1) {
      value /= 1024;
      idx += 1;
    }
    return `${value.toFixed(value >= 10 ? 1 : 2)} ${units[idx]}`;
  }

  function setText(node, value) {
    if (!node) return;
    node.textContent = value == null || value === "" ? "-" : String(value);
  }

  function extname(pathValue) {
    const value = String(pathValue || "");
    const match = value.match(/(\.[^./\\]+)$/);
    return match ? match[1].toLowerCase() : "";
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
    // When running from /app/share/, files may actually live under /app/share/public_bundle/content/...
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
      // keep raw value if decode fails
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
    const target = String(pathValue || "").replace(/\\/g, "/");
    if (!target) return null;
    const lower = target.toLowerCase();
    const exact =
      state.flattened.find((item) => String(item.path || "").replace(/\\/g, "/").toLowerCase() === lower) || null;
    if (exact) return exact;
    return (
      state.flattened.find((item) => String(item.path || "").replace(/\\/g, "/").toLowerCase().endsWith(lower)) ||
      null
    );
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

  function closeViewer() {
    if (!el.viewerPanel) return;
    hideViewerContent();
    el.viewerPanel.hidden = true;
    state.viewerPath = null;
    setText(el.viewerMeta, "Viewer closed.");
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

    if (inCode) {
      out.push(`<pre><code>${escapeHtml(codeBuf.join("\n"))}</code></pre>`);
    }
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
        // try next
      }
    }
    return null;
  }

  async function resolveReachableUrl(urls) {
    for (const url of urls) {
      try {
        const response = await fetch(url, { method: "HEAD", cache: "no-store" });
        if (response.ok) return url;
      } catch (_) {
        // HEAD may fail depending on host; try GET
      }
      try {
        const response = await fetch(url, { cache: "no-store" });
        if (response.ok) return url;
      } catch (_) {
        // try next
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
        const probe = new Image();
        probe.onload = () => resolve(url);
        probe.onerror = () => attempt();
        probe.src = url;
      };
      attempt();
    });
  }

  async function openInViewer(item) {
    const token = ++state.viewerToken;
    const selected = item || state.selected;
    if (!selected || !selected.path) {
      closeViewer();
      return;
    }

    const ext = extname(selected.path);
    const urls = candidateUrls(selected.path);
    state.viewerPath = selected.path || null;

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
        // Show helpful fallback with original filename and dataset source
        const filePath = selected.path || "";
        const fileName = filePath.split("/").pop() || filePath;
        const dsMatch = filePath.match(/DataSet(\d+)/i) || filePath.match(/DS(\d+)/i);
        const dsLabel = dsMatch ? `Dataset ${dsMatch[1]}` : "the official DOJ release";
        const fallbackHtml = `<div style="text-align:center;padding:2rem 1rem;">` +
          `<p style="font-size:1.1rem;color:var(--accent,#bf3b18);font-weight:700;margin-bottom:1rem;">` +
          `Document scan image not included in this online release</p>` +
          `<p style="margin-bottom:0.75rem;">This page image is part of the full ${dsLabel} archive ` +
          `(~5.7 GB total) and is not hosted on this site due to size limits.</p>` +
          `<p style="margin-bottom:0.5rem;"><strong>Original filename:</strong></p>` +
          `<code style="font-size:0.95rem;background:var(--surface,#1e1c1a);padding:0.4rem 0.8rem;border-radius:4px;display:inline-block;word-break:break-all;">` +
          `${fileName}</code>` +
          `<p style="margin-top:0.75rem;"><strong>Full path:</strong></p>` +
          `<code style="font-size:0.8rem;background:var(--surface,#1e1c1a);padding:0.4rem 0.8rem;border-radius:4px;display:inline-block;word-break:break-all;">` +
          `${filePath}</code>` +
          `<p style="margin-top:1.25rem;color:var(--muted,#8a7f74);font-size:0.85rem;">` +
          `Search for this filename in ${dsLabel} from the ` +
          `<a href="./release-guide.html" style="color:var(--accent,#bf3b18);">official release downloads</a>.</p>` +
          `</div>`;
        el.viewerMarkdown.innerHTML = fallbackHtml;
        el.viewerMarkdown.hidden = false;
        setViewerStatus(selected.label || "File Viewer", `Scan image not hosted | ${fileName}`);
        return;
      }
      state.openUrl = imageUrl;
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
      state.openUrl = loaded.url;

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

    state.openUrl = reachable;
    el.viewerFrame.src = reachable;
    el.viewerFrame.hidden = false;
    setViewerStatus(selected.label || "File Viewer", `Embedded file | ${selected.path}`);
  }

  function showOfflineNotice(selected) {
    const filePath = selected.path || "";
    const fileName = filePath.split("/").pop() || filePath;
    const ext = extname(filePath);
    const isImage = IMAGE_EXTS.has(ext);
    const typeLabel = isImage ? "image" : (ext === ".pdf" ? "PDF document" : "file");
    const dsMatch = filePath.match(/DataSet(\d+)/i) || filePath.match(/DS(\d+)/i);
    const dsLabel = dsMatch ? `Dataset ${dsMatch[1]}` : "the full Epstein Files archive";

    const fallbackHtml =
      `<div style="text-align:center;padding:2.5rem 1.5rem;max-width:640px;margin:0 auto;">` +
      `<p style="font-size:2rem;margin-bottom:0.5rem;">📂</p>` +
      `<p style="font-size:1.1rem;color:var(--accent,#bf3b18);font-weight:700;margin-bottom:1rem;">` +
      `File not included in online release</p>` +
      `<p style="margin-bottom:0.75rem;">This ${typeLabel} is part of ${dsLabel} ` +
      `and is not hosted on this site due to size limits.</p>` +
      `<p style="margin-bottom:0.5rem;"><strong>Filename:</strong></p>` +
      `<code style="font-size:0.95rem;background:var(--surface,#1e1c1a);padding:0.4rem 0.8rem;border-radius:4px;display:inline-block;word-break:break-all;max-width:100%;">` +
      `${fileName}</code>` +
      `<p style="margin-top:0.75rem;"><strong>Full path:</strong></p>` +
      `<code style="font-size:0.8rem;background:var(--surface,#1e1c1a);padding:0.4rem 0.8rem;border-radius:4px;display:inline-block;word-break:break-all;max-width:100%;">` +
      `${filePath}</code>` +
      `<p style="margin-top:1.25rem;color:var(--muted,#8a7f74);font-size:0.85rem;">` +
      `File content is available in the ` +
      `<a href="./release-guide.html" style="color:var(--accent,#bf3b18);">official release downloads</a>.</p>` +
      `</div>`;

    el.viewerMarkdown.innerHTML = fallbackHtml;
    el.viewerMarkdown.hidden = false;
    setViewerStatus(selected.label || "File Viewer", `Not hosted online | ${fileName}`);
  }

  function createStatCard(label, value) {
    const card = document.createElement("article");
    card.className = "stat-card";

    const labelEl = document.createElement("div");
    labelEl.className = "label";
    labelEl.textContent = label;

    const valueEl = document.createElement("div");
    valueEl.className = "value";
    valueEl.textContent = value;

    card.append(labelEl, valueEl);
    return card;
  }

  function countItemsByPrefix(payload, prefix) {
    let n = 0;
    (payload.collections || []).forEach((collection) => {
      (collection.items || []).forEach((item) => {
        if (String(item.category || "").startsWith(prefix)) n += 1;
      });
    });
    return n;
  }

  function countItemsByExt(payload, extSet) {
    let n = 0;
    (payload.collections || []).forEach((collection) => {
      (collection.items || []).forEach((item) => {
        const ext = extname(item.path || item.label || "");
        if (extSet.has(ext)) n += 1;
      });
    });
    return n;
  }

  function countSources(payload) {
    const sources = new Set();
    (payload.collections || []).forEach((collection) => {
      (collection.items || []).forEach((item) => {
        if (item.source) sources.add(item.source);
      });
    });
    return sources.size;
  }

  function totalItems(payload) {
    return (payload.collections || []).reduce((sum, collection) => sum + ((collection.items || []).length || 0), 0);
  }

  function populateStats(payload) {
    if (!el.statCards) return;
    const stats = payload.stats || {};
    const timelineEventCount =
      stats.indexed_timeline_events != null
        ? stats.indexed_timeline_events
        : (((payload.timeline || {}).events || []).length || 0);
    const cards = [
      ["Collections Included", numberFmt(stats.included_collections ?? (payload.collections || []).length)],
      ["Artifacts Included", numberFmt(stats.included_artifacts ?? totalItems(payload))],
      ["Timeline Events", numberFmt(timelineEventCount)],
      ["Email Files Included", numberFmt(stats.included_email_files ?? countItemsByPrefix(payload, "email"))],
      ["Image Files Included", numberFmt(stats.included_image_files ?? countItemsByExt(payload, IMAGE_EXTS))],
      ["Cast Profiles", numberFmt(stats.included_cast_profiles ?? countItemsByPrefix(payload, "cast-profile"))],
      ["Cast Pages", numberFmt(stats.included_cast_pages ?? countItemsByPrefix(payload, "cast-page"))],
      ["Sources Included", numberFmt(stats.included_sources ?? countSources(payload))],
    ];

    el.statCards.innerHTML = "";
    cards.forEach(([label, value]) => {
      el.statCards.appendChild(createStatCard(label, value));
    });
  }

  function populateDatasets(payload) {
    const datasets = payload.datasets || [];
    if (!el.datasetGrid) return;
    el.datasetGrid.innerHTML = "";
    if (!datasets.length) {
      el.datasetGrid.innerHTML = "<p style='color:#999'>No datasets available.</p>";
      return;
    }

    datasets.forEach((row) => {
      const card = document.createElement("div");
      card.className = "ds-card";

      // Badge class from status.
      const statusLower = String(row.status || "").toLowerCase();
      let badgeClass = "";
      let badgeLabel = row.status || "Unknown";
      if (statusLower.includes("extract")) {
        badgeClass = "extracted";
        badgeLabel = "Extracted";
      } else if (statusLower.includes("download")) {
        badgeClass = "downloading";
        badgeLabel = "Downloading";
      } else if (statusLower.includes("combined")) {
        badgeClass = "combined";
        badgeLabel = "Combined";
      }

      // Official links (DOJ / Archive).
      const links = Array.isArray(row.links) ? row.links : [];
      const officialLinksHtml = links
        .map((link) => {
          const label = escapeHtml(link.label || "Link");
          const url = escapeAttr(link.url || "#");
          return `<a class="ds-link-btn" href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
        })
        .join("");

      const dsNum = String(row.dataset || "").replace(/\D/g, "");

      // Derive an official dataset filename from DOJ URL when available.
      const dojLink = links.find((link) => /doj/i.test(String(link.label || "")));
      let officialName = "";
      if (dojLink && dojLink.url) {
        const rawName = String(dojLink.url).split("/").pop() || "";
        officialName = decodeURIComponent(rawName).trim();
      }
      if (!officialName) {
        officialName = dsNum ? `DataSet ${dsNum}.zip` : String(row.dataset || "Dataset");
      }

      // Dataset cards should open dedicated dataset pages.
      const detailsTarget = dsNum ? `./ds${dsNum}.html` : "";
      const detailTargetLabel = escapeAttr(row.dataset || "dataset");
      const detailsHrefAttr = escapeAttr(detailsTarget);
      const titleLinkAttrs = detailsTarget ? `href="${detailsHrefAttr}"` : "";
      const detailsHtml = detailsTarget
        ? `<a class="ds-open-icon" href="${detailsHrefAttr}" title="View details for ${detailTargetLabel}" aria-label="View details for ${detailTargetLabel}">↗</a>`
        : "";

      if (detailsTarget) {
        card.setAttribute("data-details-href", detailsTarget);
        card.classList.add("clickable");
      }

      card.innerHTML = [
        `<div class="ds-head">`,
        `  <div class="ds-title-wrap">`,
        titleLinkAttrs
          ? `    <a class="ds-title-link" ${titleLinkAttrs} title="View details for ${detailTargetLabel}" aria-label="View details for ${detailTargetLabel}">`
          : `    <span class="ds-title-link">`,
        `      <span class="ds-name">${escapeHtml(row.dataset || "Dataset")}</span>`,
        `      <span class="ds-official-name">${escapeHtml(officialName)}</span>`,
        titleLinkAttrs ? `    </a>` : `    </span>`,
        `  </div>`,
        `  <span class="ds-badge ${badgeClass}">${escapeHtml(badgeLabel)}</span>`,
        `</div>`,
        `<div class="ds-row">`,
        `  <div class="ds-stats">`,
        `    <span>📄 ${escapeHtml(row.individual_files || "—")} files</span>`,
        `    <span>💾 ${escapeHtml(row.estimated_size || "—")}</span>`,
        `  </div>`,
        `  <div class="ds-actions">`,
        officialLinksHtml ? `    <div class="ds-links">${officialLinksHtml}</div>` : "",
        detailsHtml ? `    ${detailsHtml}` : "",
        `  </div>`,
        `</div>`,
      ].join("\n");

      el.datasetGrid.appendChild(card);
    });
  }

  function flattenCollections(payload) {
    const collections = payload.collections || [];
    const out = [];
    collections.forEach((collection) => {
      (collection.items || []).forEach((item) => {
        if (isHiddenArtifact(item)) return;
        out.push({
          ...item,
          map_keys: Array.isArray(item.map_keys) ? item.map_keys : [],
          collection_id: collection.id,
          collection_title: collection.title,
        });
      });
    });
    return out;
  }

  function initFilters(payload) {
    const collections = payload.collections || [];
    const sources = new Set(["all"]);

    el.collectionFilter.innerHTML = "";
    const allCollectionsOpt = document.createElement("option");
    allCollectionsOpt.value = "all";
    allCollectionsOpt.textContent = "All Collections";
    el.collectionFilter.appendChild(allCollectionsOpt);

    collections.forEach((collection) => {
      const opt = document.createElement("option");
      opt.value = collection.id;
      opt.textContent = collection.title;
      el.collectionFilter.appendChild(opt);
      (collection.items || []).forEach((item) => {
        if (isHiddenArtifact(item)) return;
        sources.add(item.source || "unknown");
      });
    });

    el.sourceFilter.innerHTML = "";
    [...sources].forEach((source) => {
      const opt = document.createElement("option");
      opt.value = source;
      opt.textContent = source === "all" ? "All Sources" : source;
      el.sourceFilter.appendChild(opt);
    });
  }

  function matchesQuery(item, query) {
    if (!query) return true;
    const hay = [
      item.label,
      item.path,
      item.note,
      item.category,
      item.source,
      item.collection_title,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return hay.includes(query);
  }

  function compareText(a, b) {
    return String(a || "").localeCompare(String(b || ""), undefined, {
      numeric: true,
      sensitivity: "base",
    });
  }

  function itemModifiedMs(item) {
    const ms = Date.parse(String((item || {}).modified || ""));
    return Number.isNaN(ms) ? 0 : ms;
  }

  function itemSizeBytes(item) {
    const n = Number((item || {}).size_bytes);
    return Number.isFinite(n) ? n : 0;
  }

  function selectedMapNode() {
    if (!state.map || !state.mapSelectedId) return null;
    return state.map.nodes.find((node) => node.id === state.mapSelectedId) || null;
  }

  function applyFilters() {
    const query = state.query.trim().toLowerCase();
    state.filtered = state.flattened.filter((item) => {
      if (state.collection !== "all" && item.collection_id !== state.collection) return false;
      if (state.source !== "all" && item.source !== state.source) return false;
      if (!matchesQuery(item, query)) return false;
      if (state.mapSelectedId) {
        if (isCollectionNodeId(state.mapSelectedId)) {
          const selectedCollection = collectionIdFromNodeId(state.mapSelectedId);
          if (item.collection_id !== selectedCollection) return false;
        } else if (!item.map_keys.includes(state.mapSelectedId)) {
          return false;
        }
      }
      return true;
    });

    state.filtered.sort((a, b) => {
      const dir = state.sortDir === "asc" ? 1 : -1;
      let cmp = 0;
      switch (state.sortField) {
        case "label":
          cmp = compareText(a.label, b.label);
          break;
        case "category":
          cmp = compareText(a.category, b.category);
          break;
        case "size":
          cmp = itemSizeBytes(a) - itemSizeBytes(b);
          break;
        case "modified":
        default:
          cmp = itemModifiedMs(a) - itemModifiedMs(b);
          break;
      }
      if (cmp === 0) cmp = compareText(a.label, b.label);
      return cmp * dir;
    });
  }

  function renderArtifacts() {
    const MAX_ROWS = 200;
    const shown = state.filtered.slice(0, MAX_ROWS);
    el.artifactList.innerHTML = "";

    if (!shown.length) {
      const empty = document.createElement("p");
      empty.className = "result-meta";
      empty.style.padding = "0.8rem";
      empty.textContent = "No artifacts match this filter.";
      el.artifactList.appendChild(empty);
    } else {
      /* Build all rows in a DocumentFragment (single DOM write) */
      const frag = document.createDocumentFragment();
      shown.forEach((item, idx) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "artifact-item";
        btn.dataset.artifactIdx = String(idx);
        if (state.selected && state.selected.path === item.path && state.selected.collection_id === item.collection_id) {
          btn.classList.add("active");
        }
        btn.innerHTML = [
          "<div class='artifact-top'>",
          `<span class='artifact-label'>${escapeHtml(item.label || "-")}</span>`,
          `<span class='artifact-chip'>${escapeHtml(item.collection_title || "Collection")}</span>`,
          "</div>",
          `<div class='artifact-path'>${escapeHtml(item.path || "-")}</div>`,
          item.note ? `<div class='artifact-note'>${escapeHtml(item.note)}</div>` : "",
        ].join("");
        frag.appendChild(btn);
      });
      el.artifactList.appendChild(frag);

      /* Single delegated click handler instead of N individual listeners */
      if (!el.artifactList._delegated) {
        el.artifactList.addEventListener("click", (event) => {
          const btn = event.target.closest("button.artifact-item");
          if (!btn) return;
          const idx = Number(btn.dataset.artifactIdx);
          const item = state.filtered[idx];
          if (!item) return;
          state.selected = item;
          renderDetail();
          renderArtifacts();
          openInViewer(item);
        });
        el.artifactList._delegated = true;
      }
    }

    const suffix = state.filtered.length > MAX_ROWS ? ` (showing first ${numberFmt(MAX_ROWS)})` : "";
    const node = selectedMapNode();
    const mapSuffix = node ? ` | map focus: ${node.label}` : "";
    const sortName =
      {
        modified: "date",
        label: "name",
        category: "category",
        size: "size",
      }[state.sortField] || state.sortField;
    const sortSuffix = ` | sort: ${sortName} ${state.sortDir}`;
    el.resultMeta.textContent = `${numberFmt(state.filtered.length)} artifact(s) matched${suffix}${mapSuffix}${sortSuffix}`;
  }

  function renderDetail() {
    const item = state.selected;
    if (!item) {
      setText(el.detailLabel, "-");
      setText(el.detailPath, "-");
      setText(el.detailCategory, "-");
      setText(el.detailSource, "-");
      setText(el.detailSize, "-");
      setText(el.detailModified, "-");
      setText(el.detailNote, "-");
      el.copyPathBtn.disabled = true;
      if (el.openPathBtn) el.openPathBtn.disabled = true;
      return;
    }
    setText(el.detailLabel, item.label);
    setText(el.detailPath, item.path);
    setText(el.detailCategory, item.category);
    setText(el.detailSource, item.source);
    setText(el.detailSize, sizeFmt(item.size_bytes));
    setText(el.detailModified, item.modified);
    setText(el.detailNote, item.note || "-");
    el.copyPathBtn.disabled = false;
    if (el.openPathBtn) el.openPathBtn.disabled = false;
    if (el.viewerPanel && !el.viewerPanel.hidden && state.viewerPath !== item.path) {
      openInViewer(item);
    }
  }

  function timelineSortValue(event) {
    if (event && event.date) {
      const parsed = Date.parse(String(event.date));
      if (!Number.isNaN(parsed)) return parsed;
    }
    if (event && Number.isFinite(Number(event.year))) {
      const parsed = Date.parse(`${Number(event.year)}-01-01T00:00:00Z`);
      if (!Number.isNaN(parsed)) return parsed;
    }
    return 0;
  }

  function timelineMatches(event, query) {
    if (!query) return true;
    const hay = [
      event.title,
      event.date,
      event.summary,
      event.significance,
      event.source_label,
      event.source_path,
      event.year,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return hay.includes(query);
  }

  function applyTimelineFilters() {
    const query = state.timelineQuery.trim().toLowerCase();
    state.timelineFiltered = state.timelineAll.filter((event) => {
      if (state.timelineYear !== "all" && String(event.year || "unknown") !== state.timelineYear) return false;
      if (
        isHiddenArtifact({
          path: event && event.source_path ? event.source_path : "",
          label: event && event.source_label ? event.source_label : "",
        })
      ) {
        return false;
      }
      if (!timelineMatches(event, query)) return false;
      return true;
    });
    state.timelineFiltered.sort((a, b) => timelineSortValue(a) - timelineSortValue(b));
  }

  function renderTimeline() {
    if (!el.timelineList || !el.timelineMeta) return;
    el.timelineList.innerHTML = "";
    if (!state.timelineFiltered.length) {
      const empty = document.createElement("p");
      empty.className = "result-meta";
      empty.style.padding = "0.8rem";
      empty.textContent = "No timeline events match this filter.";
      el.timelineList.appendChild(empty);
      el.timelineMeta.textContent = "0 timeline events";
      return;
    }

    const MAX_TIMELINE_ROWS = 500;
    const visible = state.timelineFiltered.slice(0, MAX_TIMELINE_ROWS);

    const frag = document.createDocumentFragment();
    visible.forEach((event, idx) => {
      const wrap = document.createElement("article");
      wrap.className = "timeline-item";
      wrap.tabIndex = 0;
      wrap.dataset.timelineIdx = String(idx);

      const dateText = event.date_label || event.date || (event.year != null ? String(event.year) : "Unknown date");
      const sourceKind = event.source_kind === "file-date" ? "file date" : "timeline entry";

      wrap.innerHTML = [
        "<div class='timeline-title'>",
        `<strong>${escapeHtml(event.title || "Untitled Event")}</strong>`,
        `<span class='timeline-date'>${escapeHtml(dateText)}</span>`,
        "</div>",
        `<div class='timeline-summary'>${escapeHtml(event.summary || "-")}</div>`,
        `<div class='timeline-significance'>Source: ${escapeHtml(event.source_label || "-")} (${escapeHtml(sourceKind)})</div>`,
        event.significance ? `<div class='timeline-significance'>Significance: ${escapeHtml(event.significance)}</div>` : "",
        "<div class='timeline-actions'><button type='button' class='mini-btn'>Open Source</button></div>",
      ].join("");

      frag.appendChild(wrap);
    });
    el.timelineList.appendChild(frag);

    /* Single delegated handler instead of NÃ—3 individual listeners */
    if (!el.timelineList._delegated) {
      el.timelineList.addEventListener("click", async (evt) => {
        const article = evt.target.closest("article.timeline-item");
        if (!article) return;
        const idx = Number(article.dataset.timelineIdx);
        const event = state.timelineFiltered[idx];
        if (!event) return;
        const linked =
          findArtifactByPath(event.source_path) ||
          ({
            label: event.source_label || event.title || "Timeline Source",
            path: event.source_path,
            source: "repo",
            category: "timeline-doc",
            size_bytes: null,
            modified: null,
            note: "Timeline source document",
            map_keys: ["timeline", "topics"],
          });
        await openInViewer(linked);
      });
      el.timelineList._delegated = true;
    }

    const total = state.timelineFiltered.length;
    const shown = visible.length;
    el.timelineMeta.textContent = shown < total
      ? `Showing ${numberFmt(shown)} of ${numberFmt(total)} timeline event(s)`
      : `${numberFmt(total)} timeline event(s)`;
  }

  function initTimeline(payload) {
    if (!el.timelineList || !el.timelineYearFilter || !el.timelineSearch || !el.timelineMeta) return;
    const timeline = payload.timeline || {};
    let events = Array.isArray(timeline.events) ? timeline.events.slice() : [];
    if (!events.length) {
      const fallback = (createPlaceholderPayload().timeline || {}).events;
      if (Array.isArray(fallback) && fallback.length) {
        events = fallback.slice();
      }
    }
    state.timelineAll = events;

    const years = [...new Set(events.map((e) => (e && e.year != null ? String(e.year) : "unknown")))].sort(
      (a, b) => (a === "unknown" ? 1 : b === "unknown" ? -1 : Number(b) - Number(a))
    );

    el.timelineYearFilter.innerHTML = "";
    const allOpt = document.createElement("option");
    allOpt.value = "all";
    allOpt.textContent = "All Years";
    el.timelineYearFilter.appendChild(allOpt);

    years.forEach((year) => {
      const opt = document.createElement("option");
      opt.value = year;
      opt.textContent = year === "unknown" ? "Unknown Year" : year;
      el.timelineYearFilter.appendChild(opt);
    });

    state.timelineQuery = "";
    state.timelineYear = "all";
    applyTimelineFilters();
    renderTimeline();
  }

  function initCharacters(payload) {
    if (!el.characterList || !el.characterMeta || !el.characterSearch) return;
    const items = [];
    (payload.collections || []).forEach((collection) => {
      (collection.items || []).forEach((item) => {
        if (!item || !item.path) return;
        const category = String(item.category || "");
        if (category !== "cast-profile" && category !== "cast-page") return;
        if (isHiddenArtifact(item)) return;
        items.push(item);
      });
    });

    const seen = new Set();
    const out = [];
    items.forEach((item) => {
      const rawName = String(item.label || "").replace(/\s*\(cast page\)\.md$/i, "").replace(/\.md$/i, "").trim();
      const key = rawName.toLowerCase();
      if (!key || seen.has(key)) return;
      seen.add(key);
      out.push({
        name: rawName,
        item,
      });
    });

    out.sort((a, b) => a.name.localeCompare(b.name));
    state.characterAll = out;
    state.characterQuery = "";
    applyCharacterFilters();
    renderCharacters();
  }

  function applyCharacterFilters() {
    const q = state.characterQuery.trim().toLowerCase();
    state.characterFiltered = state.characterAll.filter((entry) => {
      if (!q) return true;
      const hay = [entry.name, entry.item.path, entry.item.note, entry.item.category].filter(Boolean).join(" ").toLowerCase();
      return hay.includes(q);
    });
  }

  function renderCharacters() {
    if (!el.characterList || !el.characterMeta) return;
    el.characterList.innerHTML = "";
    if (!state.characterFiltered.length) {
      const empty = document.createElement("p");
      empty.className = "result-meta";
      empty.style.padding = "0.8rem";
      empty.textContent = "No characters match this filter.";
      el.characterList.appendChild(empty);
      el.characterMeta.textContent = "0 character(s)";
      return;
    }

    state.characterFiltered.forEach((entry, idx) => {
      const row = document.createElement("article");
      row.className = "timeline-item";
      row.tabIndex = 0;
      row.dataset.charIdx = String(idx);
      row.innerHTML = [
        "<div class='timeline-title'>",
        `<strong>${escapeHtml(entry.name)}</strong>`,
        "<span class='timeline-date'>Character</span>",
        "</div>",
        `<div class='timeline-summary'>${escapeHtml(entry.item.path || "-")}</div>`,
      ].join("");

      el.characterList.appendChild(row);
    });

    /* Single delegated handler */
    if (!el.characterList._delegated) {
      el.characterList.addEventListener("click", async (evt) => {
        const row = evt.target.closest("article.timeline-item");
        if (!row || row.dataset.charIdx == null) return;
        const entry = state.characterFiltered[Number(row.dataset.charIdx)];
        if (!entry) return;
        state.selected = entry.item;
        renderDetail();
        renderArtifacts();
        await openInViewer(entry.item);
      });
      el.characterList._delegated = true;
    }

    el.characterMeta.textContent = `${numberFmt(state.characterFiltered.length)} character(s)`;
  }

  function nodeColor(type) {
    switch (type) {
      case "hub":
        return "#b6310e";
      case "dataset":
        return "#1f7a8c";
      case "collection":
        return "#3a577f";
      case "person":
        return "#7448a8";
      case "thread":
        return "#245e46";
      case "topic":
        return "#875f0b";
      case "image":
        return "#a83d6c";
      case "ai":
        return "#2f4f9b";
      case "timeline":
        return "#a04110";
      default:
        return "#6f665f";
    }
  }

  function nodeRadius(node) {
    const type = node && node.type;
    let base = 10;
    switch (type) {
      case "hub":
        base = 16;
        break;
      case "dataset":
        base = 12;
        break;
      case "collection":
        base = 13;
        break;
      case "person":
        base = 11;
        break;
      case "thread":
        base = 11;
        break;
      case "image":
        base = 11;
        break;
      case "ai":
        base = 11;
        break;
      case "timeline":
        base = 12;
        break;
      default:
        base = 10;
        break;
    }
    const value = Number((node || {}).value || 0);
    if (!Number.isFinite(value) || value <= 0) return base;
    const bump = Math.min(8, Math.log10(value + 1) * 2.2);
    return base + bump;
  }

  function hashSeed(value) {
    const s = String(value || "");
    let h = 2166136261;
    for (let i = 0; i < s.length; i += 1) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return Math.abs(h >>> 0);
  }

  function buildDynamicGraph(payload) {
    const collections = payload.collections || [];
    const keyCounts = new Map();
    const pairCounts = new Map();
    const collectionCounts = new Map();
    const collectionKeyCounts = new Map();

    collections.forEach((collection) => {
      const colId = String(collection.id || "").trim();
      if (!colId) return;

      const items = (collection.items || []).filter((item) => !isHiddenArtifact(item));
      collectionCounts.set(colId, items.length);

      const keyMap = new Map();
      items.forEach((item) => {
        const keys = Array.isArray(item.map_keys)
          ? [...new Set(item.map_keys.map((k) => String(k || "").trim().toLowerCase()).filter(Boolean))]
          : [];
        if (!keys.length) return;

        keys.forEach((key) => {
          incrementMapCount(keyCounts, key);
          incrementMapCount(keyMap, key);
        });

        for (let i = 0; i < keys.length; i += 1) {
          for (let j = i + 1; j < keys.length; j += 1) {
            const a = keys[i];
            const b = keys[j];
            const pair = a < b ? `${a}::${b}` : `${b}::${a}`;
            incrementMapCount(pairCounts, pair);
          }
        }
      });

      collectionKeyCounts.set(colId, keyMap);
    });

    const nodes = [];
    keyCounts.forEach((count, key) => {
      const known = MAP_KEY_META[key] || {};
      nodes.push({
        id: key,
        label: known.label || labelFromKey(key),
        type: known.type || "topic",
        value: count,
      });
    });

    collections.forEach((collection) => {
      const colId = String(collection.id || "").trim();
      if (!colId) return;
      const count = Number(collectionCounts.get(colId) || 0);
      if (count <= 0) return;
      nodes.push({
        id: `collection:${colId}`,
        label: collection.title || colId,
        type: "collection",
        value: count,
      });
    });

    const links = [];
    pairCounts.forEach((count, pair) => {
      const [a, b] = pair.split("::");
      if (!a || !b) return;
      if (count < 2) return;
      links.push({
        source: a,
        target: b,
        weight: count,
        label: `${numberFmt(count)} shared artifacts`,
      });
    });

    const keyTopLimit = 120;
    links.sort((a, b) => Number(b.weight || 0) - Number(a.weight || 0));
    const prunedKeyLinks = links.slice(0, keyTopLimit);

    const collectionLinks = [];
    collectionKeyCounts.forEach((keyMap, colId) => {
      const ranked = [...keyMap.entries()]
        .sort((a, b) => Number(b[1]) - Number(a[1]))
        .slice(0, 5);
      ranked.forEach(([key, count]) => {
        if (!count) return;
        collectionLinks.push({
          source: `collection:${colId}`,
          target: key,
          weight: count,
          label: `${numberFmt(count)} artifacts`,
        });
      });
    });

    const outNodes = nodes
      .filter((node) => {
        if (isCollectionNodeId(node.id)) return true;
        return Number(node.value || 0) > 0;
      })
      .sort((a, b) => {
        const byCollection = Number(isCollectionNodeId(a.id)) - Number(isCollectionNodeId(b.id));
        if (byCollection !== 0) return byCollection;
        return Number(b.value || 0) - Number(a.value || 0);
      });

    const outLinks = [...prunedKeyLinks, ...collectionLinks];
    if (!outNodes.length || !outLinks.length) {
      return payload.graph || { nodes: [], links: [] };
    }
    return { nodes: outNodes, links: outLinks };
  }

  function connectedNodeIds(selectedId, links) {
    const out = new Set([selectedId]);
    links.forEach((link) => {
      if (link.source.id === selectedId) out.add(link.target.id);
      if (link.target.id === selectedId) out.add(link.source.id);
    });
    return out;
  }

  function clearSvg(svg) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
  }

  function initMindMap(payload) {
    if (!el.mindmapSvg) return;
    const graph = buildDynamicGraph(payload);
    const nodes = (graph.nodes || []).map((node, idx) => {
      const seed = hashSeed(node.id || idx);
      const angle = ((seed % 360) * Math.PI) / 180;
      const radialBase = isCollectionNodeId(node.id) ? 220 : 130;
      const radial = radialBase + ((seed % 5) - 2) * 20;
      const jitter = ((seed >> 8) % 13) - 6;
      return {
        ...node,
        r: nodeRadius(node),
        x: MAP_W / 2 + Math.cos(angle) * radial + jitter,
        y: MAP_H / 2 + Math.sin(angle) * radial - jitter,
        vx: 0,
        vy: 0,
        g: null,
        lineRefs: [],
      };
    });
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    const links = (graph.links || [])
      .map((link) => ({
        ...link,
        weight: Number(link.weight || 1),
        source: nodeMap.get(link.source),
        target: nodeMap.get(link.target),
        el: null,
      }))
      .filter((link) => link.source && link.target);

    clearSvg(el.mindmapSvg);
    el.mindmapSvg.setAttribute("viewBox", `0 0 ${MAP_W} ${MAP_H}`);

    const linkLayer = document.createElementNS(SVG_NS, "g");
    linkLayer.setAttribute("class", "map-links");
    el.mindmapSvg.appendChild(linkLayer);

    const nodeLayer = document.createElementNS(SVG_NS, "g");
    nodeLayer.setAttribute("class", "map-nodes");
    el.mindmapSvg.appendChild(nodeLayer);

    links.forEach((link) => {
      const line = document.createElementNS(SVG_NS, "line");
      line.setAttribute("class", "map-link");
      link.el = line;
      linkLayer.appendChild(line);
    });

    nodes.forEach((node) => {
      const g = document.createElementNS(SVG_NS, "g");
      g.setAttribute("class", "map-node");
      g.setAttribute("tabindex", "0");
      g.dataset.nodeId = node.id;

      const circle = document.createElementNS(SVG_NS, "circle");
      circle.setAttribute("r", String(node.r));
      circle.setAttribute("fill", nodeColor(node.type));
      circle.setAttribute("stroke", "#ffffff");
      circle.setAttribute("stroke-width", "2");
      g.appendChild(circle);

      const label = document.createElementNS(SVG_NS, "text");
      label.textContent = node.label || node.id;
      label.setAttribute("x", String(node.r + 8));
      label.setAttribute("y", "5");
      label.setAttribute("class", "map-label");
      g.appendChild(label);

      const title = document.createElementNS(SVG_NS, "title");
      const volume = Number(node.value || 0);
      title.textContent = volume > 0 ? `${node.label || node.id} (${numberFmt(volume)} artifacts)` : node.label || node.id;
      g.appendChild(title);

      g.addEventListener("click", () => {
        setMapSelection(node.id);
      });
      g.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setMapSelection(node.id);
        }
      });

      node.g = g;
      nodeLayer.appendChild(g);
    });

    state.map = {
      nodes,
      links,
      nodeMap,
      rafId: null,
      ticks: 0,
    };

    runMindMapSimulation();
    renderMindMap();
    updateMindMapMeta();
  }

  function runMindMapSimulation() {
    if (!state.map) return;
    const map = state.map;
    map.ticks = 0;

    /* Run physics in batches off-screen, then render once settled.
       This avoids 200 consecutive rAF DOM updates that choke resizing. */
    const BATCH = 10;       // physics steps per idle chunk
    const MAX_TICKS = 120;  // total iterations (was 200)

    const settle = () => {
      if (!state.map) return;
      const limit = Math.min(map.ticks + BATCH, MAX_TICKS);
      while (map.ticks < limit) {
        map.ticks += 1;
        stepMindMapPhysics();
      }
      renderMindMap();
      if (map.ticks < MAX_TICKS) {
        map.rafId = requestAnimationFrame(settle);
      } else {
        map.rafId = null;
      }
    };

    if (map.rafId) cancelAnimationFrame(map.rafId);
    map.rafId = requestAnimationFrame(settle);
  }

  function stepMindMapPhysics() {
    if (!state.map) return;
    const nodes = state.map.nodes;
    const links = state.map.links;
    const repulse = 3600;
    const centerPull = 0.0019;
    const damping = 0.87;
    const edgePad = 28;

    for (let i = 0; i < nodes.length; i += 1) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j += 1) {
        const b = nodes[j];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        const distSq = dx * dx + dy * dy + 0.6;
        const dist = Math.sqrt(distSq);
        dx /= dist;
        dy /= dist;
        const f = repulse / distSq;
        a.vx -= dx * f;
        a.vy -= dy * f;
        b.vx += dx * f;
        b.vy += dy * f;
      }
    }

    links.forEach((link) => {
      const a = link.source;
      const b = link.target;
      let dx = b.x - a.x;
      let dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;
      dx /= dist;
      dy /= dist;
      const weight = Math.max(1, Number(link.weight || 1));
      const strength = 1 + Math.min(2.4, Math.log10(weight + 1));
      const desired = (a.r + b.r) * 3.3 + 28 - Math.min(34, Math.log10(weight + 1) * 11);
      const spring = (dist - desired) * 0.008 * strength;
      a.vx += dx * spring;
      a.vy += dy * spring;
      b.vx -= dx * spring;
      b.vy -= dy * spring;
    });

    nodes.forEach((node) => {
      node.vx += (MAP_W / 2 - node.x) * centerPull;
      node.vy += (MAP_H / 2 - node.y) * centerPull;
      node.vx *= damping;
      node.vy *= damping;
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < edgePad) {
        node.x = edgePad;
        node.vx = Math.abs(node.vx) * 0.25;
      }
      if (node.x > MAP_W - edgePad) {
        node.x = MAP_W - edgePad;
        node.vx = -Math.abs(node.vx) * 0.25;
      }
      if (node.y < edgePad) {
        node.y = edgePad;
        node.vy = Math.abs(node.vy) * 0.25;
      }
      if (node.y > MAP_H - edgePad) {
        node.y = MAP_H - edgePad;
        node.vy = -Math.abs(node.vy) * 0.25;
      }
    });
  }

  function renderMindMap() {
    if (!state.map) return;
    const selectedId = state.mapSelectedId;
    const neighborIds = selectedId ? connectedNodeIds(selectedId, state.map.links) : null;

    state.map.links.forEach((link) => {
      link.el.setAttribute("x1", String(link.source.x));
      link.el.setAttribute("y1", String(link.source.y));
      link.el.setAttribute("x2", String(link.target.x));
      link.el.setAttribute("y2", String(link.target.y));

      const touches = selectedId && (link.source.id === selectedId || link.target.id === selectedId);
      link.el.classList.toggle("active", Boolean(touches));
      link.el.classList.toggle("dimmed", Boolean(selectedId && !touches));

       const weight = Math.max(1, Number(link.weight || 1));
       const baseWidth = 0.9 + Math.min(3.2, Math.log10(weight + 1) * 1.35);
       link.el.style.strokeWidth = touches ? String(Math.max(2.2, baseWidth + 0.8)) : String(baseWidth);
       link.el.style.strokeOpacity = selectedId
         ? touches
           ? "1"
           : "0.12"
         : String(Math.min(0.95, 0.22 + Math.log10(weight + 1) * 0.2));
       if (!selectedId) link.el.classList.remove("dimmed");
    });

    state.map.nodes.forEach((node) => {
      node.g.setAttribute("transform", `translate(${node.x},${node.y})`);
      const isSelected = selectedId && node.id === selectedId;
      const isNeighbor = neighborIds && neighborIds.has(node.id);
      node.g.classList.toggle("selected", Boolean(isSelected));
      node.g.classList.toggle("dimmed", Boolean(selectedId && !isNeighbor));
    });
  }

  function setMapSelection(nodeId) {
    state.mapSelectedId = state.mapSelectedId === nodeId ? null : nodeId;
    applyFilters();
    renderArtifacts();
    renderMindMap();
    updateMindMapMeta();
    renderMapSidebar();
  }

  function updateMindMapMeta() {
    if (!state.map || !el.mindmapMeta) return;
    const node = selectedMapNode();
    if (!node) {
      const top = state.map.nodes
        .filter((n) => !isCollectionNodeId(n.id))
        .sort((a, b) => Number(b.value || 0) - Number(a.value || 0))
        .slice(0, 3)
        .map((n) => `${n.label}: ${numberFmt(n.value || 0)}`)
        .join(" | ");
      el.mindmapMeta.textContent = `${numberFmt(state.map.nodes.length)} nodes, ${numberFmt(state.map.links.length)} links. ${top ? `Top coverage: ${top}. ` : ""}Click a node to focus related artifacts.`;
      return;
    }
    const related = isCollectionNodeId(node.id)
      ? state.flattened.filter((item) => item.collection_id === collectionIdFromNodeId(node.id)).length
      : state.flattened.filter((item) => item.map_keys.includes(node.id)).length;
    const neighbors = connectedNodeIds(node.id, state.map.links).size - 1;
    const nodeVolume = Number(node.value || 0);
    el.mindmapMeta.textContent = `Focused: ${node.label} | related artifacts: ${numberFmt(related)} | node volume: ${numberFmt(nodeVolume)} | direct links: ${numberFmt(neighbors)}`;
  }

  function renderMapSidebar() {
    if (!el.mapSidebar) return;
    const node = selectedMapNode();

    if (!node) {
      el.mapSidebar.innerHTML = "<div class='map-sidebar-empty'><p>👈 Click a node on the map to see connected items here</p></div>";
      return;
    }

    /* Connected neighbor nodes */
    const neighborIds = connectedNodeIds(node.id, state.map.links);
    const neighborNodes = state.map.nodes
      .filter((n) => neighborIds.has(n.id) && n.id !== node.id)
      .sort((a, b) => Number(b.value || 0) - Number(a.value || 0));

    /* Related artifacts */
    const MAX_SIDEBAR_ITEMS = 100;
    const related = isCollectionNodeId(node.id)
      ? state.flattened.filter((item) => item.collection_id === collectionIdFromNodeId(node.id))
      : state.flattened.filter((item) => item.map_keys.includes(node.id));
    const totalRelated = related.length;
    const shown = related.slice(0, MAX_SIDEBAR_ITEMS);

    let html = "";

    /* Header */
    html += "<div class='map-sidebar-header'>";
    html += "FOCUSED NODE";
    html += "<span class='sidebar-node-name'>" + escapeHtml(node.label) + "</span>";
    html += "<span class='sidebar-stats'>" + numberFmt(totalRelated) + " artifacts &middot; " + numberFmt(neighborNodes.length) + " connected nodes</span>";
    html += "</div>";

    /* Connected nodes chips */
    if (neighborNodes.length > 0) {
      html += "<div class='map-sidebar-section'>";
      html += "<h4>Connected Nodes</h4>";
      html += "<div class='map-sidebar-nodes'>";
      neighborNodes.forEach((n) => {
        html += "<span class='map-sidebar-node-chip' data-node-id='" + escapeHtml(n.id) + "' title='" + escapeHtml(n.label) + " (" + numberFmt(n.value || 0) + ")'>" + escapeHtml(n.label) + "</span>";
      });
      html += "</div></div>";
    }

    /* Artifact list */
    html += "<div class='map-sidebar-items'>";
    if (shown.length === 0) {
      html += "<div style='padding:1rem;color:#9a8e82;text-align:center;font-size:0.78rem'>No artifacts linked to this node.</div>";
    } else {
      shown.forEach((item) => {
        html += "<button class='map-sidebar-item' data-path='" + escapeHtml(item.path || "") + "' data-collection='" + escapeHtml(item.collection_id || "") + "'>";
        html += "<span class='sidebar-item-label'>" + escapeHtml(item.label || "-") + "</span>";
        html += "<span class='sidebar-item-path'>" + escapeHtml(item.path || "-") + "</span>";
        if (item.collection_title) html += "<span class='sidebar-item-collection'>" + escapeHtml(item.collection_title) + "</span>";
        html += "</button>";
      });
      if (totalRelated > MAX_SIDEBAR_ITEMS) {
        html += "<div style='padding:0.6rem 0.8rem;color:#8a7e72;font-size:0.7rem;text-align:center'>+ " + numberFmt(totalRelated - MAX_SIDEBAR_ITEMS) + " more in File Explorer below ↓</div>";
      }
    }
    html += "</div>";

    el.mapSidebar.innerHTML = html;

    /* Click handlers for node chips */
    el.mapSidebar.querySelectorAll(".map-sidebar-node-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        const nodeId = chip.dataset.nodeId;
        if (nodeId) setMapSelection(nodeId);
      });
    });

    /* Click handlers for artifact items */
    el.mapSidebar.querySelectorAll(".map-sidebar-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        const path = btn.dataset.path;
        const colId = btn.dataset.collection;
        const item = state.flattened.find((it) => it.path === path && it.collection_id === colId);
        if (item) {
          state.selected = item;
          renderDetail();
          renderArtifacts();
          openInViewer(item);
        }
      });
    });
  }

  function bindEvents() {
    /* Debounce helper â€” prevents filtering 50K items on every keystroke */
    let _searchTimer = null;
    const debounceSearch = (fn, ms) => {
      if (_searchTimer) clearTimeout(_searchTimer);
      _searchTimer = setTimeout(fn, ms);
    };

    el.searchInput.addEventListener("input", (event) => {
      state.query = event.target.value || "";
      debounceSearch(() => { applyFilters(); renderArtifacts(); }, 180);
    });

    el.collectionFilter.addEventListener("change", (event) => {
      state.collection = event.target.value || "all";
      applyFilters();
      renderArtifacts();
    });

    el.sourceFilter.addEventListener("change", (event) => {
      state.source = event.target.value || "all";
      applyFilters();
      renderArtifacts();
    });

    if (el.sortField) {
      el.sortField.addEventListener("change", (event) => {
        state.sortField = event.target.value || "modified";
        applyFilters();
        renderArtifacts();
      });
    }

    if (el.sortDir) {
      el.sortDir.addEventListener("change", (event) => {
        state.sortDir = event.target.value || "desc";
        applyFilters();
        renderArtifacts();
      });
    }

    if (el.timelineSearch) {
      let _tlTimer = null;
      el.timelineSearch.addEventListener("input", (event) => {
        state.timelineQuery = event.target.value || "";
        if (_tlTimer) clearTimeout(_tlTimer);
        _tlTimer = setTimeout(() => { applyTimelineFilters(); renderTimeline(); }, 180);
      });
    }

    if (el.timelineYearFilter) {
      el.timelineYearFilter.addEventListener("change", (event) => {
        state.timelineYear = event.target.value || "all";
        applyTimelineFilters();
        renderTimeline();
      });
    }

    if (el.characterSearch) {
      let _charTimer = null;
      el.characterSearch.addEventListener("input", (event) => {
        state.characterQuery = event.target.value || "";
        if (_charTimer) clearTimeout(_charTimer);
        _charTimer = setTimeout(() => { applyCharacterFilters(); renderCharacters(); }, 180);
      });
    }

    if (el.clearMapBtn) {
      el.clearMapBtn.addEventListener("click", () => {
        state.mapSelectedId = null;
        applyFilters();
        renderArtifacts();
        renderMindMap();
        updateMindMapMeta();
        renderMapSidebar();
      });
    }

    el.copyPathBtn.addEventListener("click", async () => {
      if (!state.selected || !state.selected.path) return;
      try {
        await navigator.clipboard.writeText(state.selected.path);
        el.copyPathBtn.textContent = "Copied";
        setTimeout(() => {
          el.copyPathBtn.textContent = "Copy Path";
        }, 900);
      } catch (err) {
        el.copyPathBtn.textContent = "Copy failed";
        setTimeout(() => {
          el.copyPathBtn.textContent = "Copy Path";
        }, 900);
      }
    });

    if (el.openPathBtn) {
      el.openPathBtn.addEventListener("click", async () => {
        if (!state.selected || !state.selected.path) return;
        await openInViewer(state.selected);
      });
    }

    if (el.datasetGrid) {
      el.datasetGrid.addEventListener("click", async (event) => {
        const anchor = event.target.closest("a[data-doc-path]");
        if (anchor) {
          event.preventDefault();
          const pathValue = anchor.getAttribute("data-doc-path");
          if (!pathValue) return;
          const linked =
            findArtifactByPath(pathValue) ||
            ({
              label: pathValue.split("/").pop() || "Linked file",
              path: pathValue,
              source: "bundle",
              category: "linked",
              size_bytes: null,
              modified: null,
              note: "Opened from dataset index link",
              map_keys: [],
            });
          await openInViewer(linked);
          return;
        }

        // Ignore clicks already on an anchor (external links/icons handle themselves).
        if (event.target.closest("a")) return;

        const card = event.target.closest(".ds-card.clickable");
        if (!card) return;

        const cardDocPath = card.getAttribute("data-doc-path");
        if (cardDocPath) {
          const linked =
            findArtifactByPath(cardDocPath) ||
            ({
              label: cardDocPath.split("/").pop() || "Linked file",
              path: cardDocPath,
              source: "bundle",
              category: "linked",
              size_bytes: null,
              modified: null,
              note: "Opened from dataset card",
              map_keys: [],
            });
          await openInViewer(linked);
          return;
        }

        const href = card.getAttribute("data-details-href");
        if (href) {
          window.location.href = href;
        }
      });
    }

    if (el.closeViewerBtn) {
      el.closeViewerBtn.addEventListener("click", () => {
        closeViewer();
      });
    }

    if (el.viewerMarkdown) {
      el.viewerMarkdown.addEventListener("click", async (event) => {
        const anchor = event.target.closest("a");
        if (!anchor) return;
        const href = anchor.getAttribute("href");
        const resolved = resolveBundleLink(href, state.viewerPath);
        if (!resolved) {
          if (/^https?:\/\//i.test(String(href || ""))) {
            anchor.target = "_blank";
            anchor.rel = "noopener noreferrer";
          }
          return;
        }
        event.preventDefault();
        const linked =
          findArtifactByPath(resolved) ||
          ({
            label: resolved.split("/").pop() || "Linked file",
            path: resolved,
            source: "bundle",
            category: "linked",
            size_bytes: null,
            modified: null,
            note: "Opened from markdown link",
            map_keys: [],
          });
        await openInViewer(linked);
      });
    }
  }

  function escapeHtml(input) {
    return String(input)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function escapeAttr(input) {
    return String(input)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function applyInitialRouteState() {
    let params = null;
    try {
      params = new URLSearchParams(window.location.search || "");
    } catch (_) {
      return;
    }

    const query = String(params.get("q") || params.get("query") || "").trim();
    if (query) {
      state.query = query;
      if (el.searchInput) el.searchInput.value = query;
    }

    const collection = String(params.get("collection") || "").trim();
    if (collection && el.collectionFilter && [...el.collectionFilter.options].some((opt) => opt.value === collection)) {
      state.collection = collection;
      el.collectionFilter.value = collection;
    }

    const source = String(params.get("source") || "").trim();
    if (source && el.sourceFilter && [...el.sourceFilter.options].some((opt) => opt.value === source)) {
      state.source = source;
      el.sourceFilter.value = source;
    }

    const timelineQuery = String(params.get("timeline_q") || "").trim();
    if (timelineQuery) {
      state.timelineQuery = timelineQuery;
      if (el.timelineSearch) el.timelineSearch.value = timelineQuery;
    }

    const characterQuery = String(params.get("cast_q") || "").trim();
    if (characterQuery) {
      state.characterQuery = characterQuery;
      if (el.characterSearch) el.characterSearch.value = characterQuery;
    }

    const jump = String(params.get("section") || "").trim().toLowerCase();
    if (jump) {
      const bySection = {
        timeline: el.timelineList,
        cast: el.characterList,
        explorer: el.artifactList,
        datasets: el.datasetGrid,
      };
      const target = bySection[jump];
      if (target && typeof target.scrollIntoView === "function") {
        setTimeout(() => {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 320);
      }
    }
  }

  function init(payload) {
    state.payload = payload;

    /* â”€â”€ Phase 1: Critical-path rendering (show UI fast) â”€â”€ */
    setText(el.generatedAt, `Generated: ${payload.generated_at || "-"}`);
    setText(el.rootPath, "Source: public release bundle");
    populateStats(payload);      // uses pre-computed stats, nearly free
    populateDatasets(payload);
    bindEvents();

    /* â”€â”€ Phase 2: Flatten + first artifact page (deferred one tick) â”€â”€ */
    setTimeout(function phase2() {
      state.flattened = flattenCollections(payload);
      state.filtered = state.flattened.slice();
      initFilters(payload);
      applyInitialRouteState();
      if (el.sortField) el.sortField.value = state.sortField;
      if (el.sortDir) el.sortDir.value = state.sortDir;
      applyFilters();
      renderArtifacts();
      renderDetail();

      /* â”€â”€ Phase 3: Heavy modules (deferred further) â”€â”€ */
      setTimeout(function phase3() {
        initTimeline(payload);
      }, 60);
      setTimeout(function phase4() {
        initCharacters(payload);
      }, 120);
      if (HAS_MINDMAP) {
        setTimeout(function phase5() {
          initMindMap(payload);
        }, 200);
      }
    }, 0);
  }

  async function loadPayload() {
    if (window.TRUMP_FILES_DATA) {
      return window.TRUMP_FILES_DATA;
    }
    if (window.EVIDENCE_ATLAS_DATA) {
      return window.EVIDENCE_ATLAS_DATA;
    }
    const candidates = ["./data/public-data.json", "./data/demo-data.json"];
    for (const url of candidates) {
      try {
        const response = await fetch(url);
        if (!response.ok) continue;
        return await response.json();
      } catch (_) {
        // try next
      }
    }
    return createPlaceholderPayload();
  }

  loadPayload().then((payload) => init(payload));

  if (HAS_MINDMAP) {
    /* â”€â”€ Pause mind map physics during resize for smoother UX â”€â”€ */
    let _resizeTimer = null;
    let _mapWasPaused = false;
    window.addEventListener(
      "resize",
      () => {
        if (state.map && state.map.rafId) {
          cancelAnimationFrame(state.map.rafId);
          state.map.rafId = null;
          _mapWasPaused = true;
        }
        if (_resizeTimer) clearTimeout(_resizeTimer);
        _resizeTimer = setTimeout(() => {
          if (_mapWasPaused && state.map) {
            renderMindMap(); // single repaint after resize settles
            _mapWasPaused = false;
          }
        }, 200);
      },
      { passive: true }
    );

    /* â”€â”€ Pause animation when tab is hidden â”€â”€ */
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && state.map && state.map.rafId) {
        cancelAnimationFrame(state.map.rafId);
        state.map.rafId = null;
      }
    });
  }
})();

