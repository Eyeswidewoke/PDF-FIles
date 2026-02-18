(function () {
  "use strict";

  const DOC_ID_PATTERN = /(EFTA|EPSTEIN)(-?)(\d{4,})/i;
  const NEIGHBOR_WINDOWS = new Set([1, 2, 5, 10]);
  const DEFAULT_NEIGHBOR_WINDOW = 2;

  const state = {
    network: null,
    bundle: null,
    members: [],
    edges: [],
    memberBySlug: new Map(),
    filteredMembers: [],
    filteredEdges: [],
    availablePaths: new Set(),
    linkMaps: {
      castPages: new Map(),
      castProfiles: new Map(),
      peopleBuckets: new Map(),
    },
    viewerPath: "",
    viewerRequestToken: 0,
    viewerNeighborWindow: DEFAULT_NEIGHBOR_WINDOW,
  };

  const $ = (id) => document.getElementById(id);

  function escapeHtml(input) {
    return String(input || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function normalizeKey(input) {
    return String(input || "")
      .replace(/\.md$/i, "")
      .replace(/\s*\(cast page\)$/i, "")
      .replace(/\s*\(people bucket\)$/i, "")
      .replace(/\s+/g, " ")
      .replace(/^_+/, "")
      .replace(/[^a-z0-9]+/gi, " ")
      .toLowerCase()
      .trim();
  }

  function normalizePath(input) {
    return String(input || "")
      .replace(/\\/g, "/")
      .replace(/^\.?\//, "")
      .trim();
  }

  function indexAvailablePaths() {
    const paths = new Set();

    const collections = (state.bundle && state.bundle.collections) || [];
    collections.forEach((collection) => {
      (collection.items || []).forEach((item) => {
        const path = normalizePath(item && item.path);
        if (!path) return;
        if (isExternalHref(path)) return;
        paths.add(path);
      });
    });

    state.availablePaths = paths;
  }

  function firstAvailablePath() {
    for (let i = 0; i < arguments.length; i += 1) {
      const clean = normalizePath(arguments[i]);
      if (!clean) continue;
      if (state.availablePaths.has(clean)) return clean;
    }
    return "";
  }

  function findPathByBasename(path) {
    const clean = normalizePath(path);
    if (!clean) return "";
    const parts = clean.split("/");
    const base = (parts[parts.length - 1] || "").toLowerCase();
    if (!base) return "";

    const matches = [];
    state.availablePaths.forEach((candidate) => {
      const c = normalizePath(candidate);
      if (!c) return;
      if (c.toLowerCase().endsWith("/" + base) || c.toLowerCase() === base) {
        matches.push(c);
      }
    });

    if (!matches.length) return "";
    if (matches.length === 1) return matches[0];

    if (clean.toLowerCase().includes("/content/emails/cast-flagged/")) {
      const cast = matches.find((m) => m.toLowerCase().includes("/content/emails/cast-flagged/"));
      if (cast) return cast;
    }
    if (clean.toLowerCase().includes("/content/emails/flagged/")) {
      const flagged = matches.find((m) => m.toLowerCase().includes("/content/emails/flagged/"));
      if (flagged) return flagged;
    }
    return matches.sort()[0];
  }

  function resolveKnownPath(path) {
    const clean = normalizePath(path);
    if (!clean) return "";

    const variants = [
      clean,
      clean.replace(/^content\/emails\/email-cast-flagged\//i, "content/emails/cast-flagged/"),
      clean.replace(/^content\/emails\/cast-flagged\//i, "content/emails/email-cast-flagged/"),
      clean.replace(/^content\/emails\/email-flagged\//i, "content/emails/flagged/"),
      clean.replace(/^content\/emails\/flagged\//i, "content/emails/email-flagged/"),
    ];

    const direct = firstAvailablePath.apply(null, variants);
    if (direct) return direct;
    return findPathByBasename(clean);
  }

  function sanitizeNeighborWindow(value) {
    const n = Number(value);
    return NEIGHBOR_WINDOWS.has(n) ? n : DEFAULT_NEIGHBOR_WINDOW;
  }

  function parseNumberedPath(path) {
    const clean = normalizePath(path);
    if (!clean) return null;

    const parts = clean.split("/");
    const filename = parts.pop() || "";
    const match = filename.match(DOC_ID_PATTERN);
    if (!match) return null;

    const id = Number(match[3]);
    if (!Number.isFinite(id)) return null;

    return {
      path: clean,
      dir: parts.join("/"),
      filename,
      token: match[0],
      prefix: match[1],
      separator: match[2] || "",
      width: match[3].length,
      id,
    };
  }

  function buildNeighborPath(parsed, id) {
    if (!parsed || !Number.isFinite(id) || id <= 0) return "";
    const token = parsed.prefix + parsed.separator + String(id).padStart(parsed.width, "0");
    const neighborFilename = parsed.filename.replace(parsed.token, token);
    return normalizePath((parsed.dir ? parsed.dir + "/" : "") + neighborFilename);
  }

  function collectNeighborTargets(path, windowSize) {
    const parsed = parseNumberedPath(path);
    if (!parsed) return [];

    const seen = new Set();
    const out = [];

    for (let delta = -windowSize; delta <= windowSize; delta += 1) {
      const targetId = parsed.id + delta;
      if (targetId <= 0) continue;

      if (delta === 0) {
        const currentKey = normalizePath(parsed.path);
        if (!seen.has(currentKey)) {
          seen.add(currentKey);
          out.push({
            delta: 0,
            id: targetId,
            path: parsed.path,
            attemptedPath: parsed.path,
          });
        }
        continue;
      }

      const attemptedPath = buildNeighborPath(parsed, targetId);
      const known = resolveKnownPath(attemptedPath);
      const key = normalizePath(known || attemptedPath);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push({
        delta,
        id: targetId,
        path: known || "",
        attemptedPath,
      });
    }

    return out;
  }

  function neighborDeltaLabel(delta) {
    if (!Number(delta)) return "Current";
    return delta > 0 ? "+" + delta : String(delta);
  }

  function updateViewerNeighborControls(path) {
    const select = $("viewerNeighborWindow");
    const button = $("viewerNeighborsBtn");
    const meta = $("viewerNeighborMeta");

    state.viewerPath = normalizePath(path || state.viewerPath || "");
    state.viewerNeighborWindow = sanitizeNeighborWindow(select ? select.value : state.viewerNeighborWindow);

    if (select) {
      select.value = String(state.viewerNeighborWindow);
    }
    if (button) {
      button.textContent = "Open +/-" + state.viewerNeighborWindow + " neighbors";
    }

    const parsed = parseNumberedPath(state.viewerPath);
    if (!parsed) {
      if (button) button.disabled = true;
      if (meta) {
        meta.textContent = state.viewerPath
          ? "No numeric EFTA/EPSTEIN ID in this file name."
          : "Open a numbered file to enable nearby context.";
      }
      return;
    }

    const targets = collectNeighborTargets(state.viewerPath, state.viewerNeighborWindow);
    const availableNeighborCount = targets.filter((entry) => entry.delta !== 0 && !!entry.path).length;
    if (button) button.disabled = false;
    if (meta) {
      meta.textContent = availableNeighborCount
        ? "Found " + formatNumber(availableNeighborCount) + " nearby file(s) in this bundle."
        : "No nearby numbered files in this bundle for this window.";
    }
  }

  function pathToFetchUrl(path) {
    const clean = normalizePath(path);
    return (
      "./" +
      clean
        .split("/")
        .map((segment) => {
          try {
            return encodeURIComponent(decodeURIComponent(segment));
          } catch (_) {
            return encodeURIComponent(segment);
          }
        })
        .join("/")
    );
  }

  function isExternalHref(href) {
    const value = String(href || "").trim();
    return /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(value) || value.startsWith("//");
  }

  function resolveInternalPath(basePath, href) {
    const raw = String(href || "").trim();
    if (!raw || raw.startsWith("#") || isExternalHref(raw)) return "";

    let noHash = raw.split("#")[0].split("?")[0];
    if (!noHash) return "";

    noHash = noHash.replace(/\\/g, "/");
    // Normalize leading dot-slashes so "./content/..." resolves to bundle root.
    noHash = noHash.replace(/^(?:\.\/)+/, "");
    if (noHash.startsWith("./")) noHash = noHash.slice(2);

    if (noHash.startsWith("/")) {
      return normalizePath(noHash);
    }
    if (/^(content|data)\//i.test(noHash)) {
      return normalizePath(noHash);
    }

    const base = normalizePath(basePath || "");
    const baseDir = base.includes("/") ? base.slice(0, base.lastIndexOf("/") + 1) : "";

    try {
      const url = new URL(noHash, "https://local/" + baseDir);
      return normalizePath(decodeURIComponent(url.pathname).replace(/^\/+/, ""));
    } catch (_) {
      return normalizePath(noHash);
    }
  }

  function formatNumber(n) {
    return Number(n || 0).toLocaleString();
  }

  function categoryLabel(catCode) {
    const categories = (state.network && state.network.categories) || {};
    return (categories[catCode] && categories[catCode].label) || catCode || "Uncategorized";
  }

  function stripSummary(summary) {
    const raw = String(summary || "")
      .replace(/^\uFEFF/, "")
      .replace(/^#+\s*/, "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/`/g, "")
      .trim();
    if (!raw) return "(no summary)";
    return raw.length > 180 ? raw.slice(0, 177) + "..." : raw;
  }

  function collectionItemsByTitle(title) {
    const collections = (state.bundle && state.bundle.collections) || [];
    const found = collections.find((c) => String(c.title || "").toLowerCase() === String(title).toLowerCase());
    return (found && found.items) || [];
  }

  function buildLinkMaps() {
    const castPages = collectionItemsByTitle("Cast Pages");
    const castProfiles = collectionItemsByTitle("Cast Profiles");
    const peopleBuckets = collectionItemsByTitle("People Email Buckets");

    castPages.forEach((item) => {
      const label = String(item.label || "");
      if (/^cast-hub\.md$/i.test(label)) return;
      state.linkMaps.castPages.set(normalizeKey(label), normalizePath(item.path));
    });

    castProfiles.forEach((item) => {
      state.linkMaps.castProfiles.set(normalizeKey(item.label), normalizePath(item.path));
    });

    peopleBuckets.forEach((item) => {
      state.linkMaps.peopleBuckets.set(normalizeKey(item.label), normalizePath(item.path));
    });
  }

  function sumMentions(member) {
    const groups = member.connections || {};
    let total = 0;
    Object.values(groups).forEach((arr) => {
      (arr || []).forEach((edge) => {
        if (!edge || edge.slug === member.slug) return;
        total += Number(edge.mentions || 0);
      });
    });
    return total;
  }

  function buildMemberRecords() {
    const members = (state.network && state.network.members) || [];
    state.members = members.map((member) => {
      const key = normalizeKey(member.name);
      const profileFromMemberFile = member.file
        ? normalizePath("content/cast/profiles/" + String(member.file).replace(/\\/g, "/"))
        : "";
      const profilePath = firstAvailablePath(
        state.linkMaps.castProfiles.get(key),
        profileFromMemberFile
      );
      const pagePath = firstAvailablePath(
        state.linkMaps.castPages.get(key),
        member.slug ? "content/cast/pages/08-epstein-network-" + String(member.slug) + ".md" : ""
      );
      const bucketPath = firstAvailablePath(state.linkMaps.peopleBuckets.get(key) || "");
      const connectionMentions = sumMentions(member);
      return {
        slug: member.slug,
        name: member.name,
        category: member.category,
        categoryLabel: categoryLabel(member.category),
        connectionCount: Number(member.connection_count || 0),
        connectionMentions,
        topicMentionCount: Array.isArray(member.topic_mentions) ? member.topic_mentions.length : 0,
        summary: stripSummary(member.summary),
        profilePath,
        pagePath,
        bucketPath,
      };
    });
    state.memberBySlug = new Map(state.members.map((m) => [m.slug, m]));
  }

  function buildEdgeRecords() {
    const pairMap = new Map();
    const members = (state.network && state.network.members) || [];

    members.forEach((member) => {
      const groups = member.connections || {};
      Object.entries(groups).forEach(([context, list]) => {
        (list || []).forEach((target) => {
          if (!target || !target.slug || target.slug === member.slug) return;
          const pair = [member.slug, target.slug].sort();
          const key = pair[0] + "||" + pair[1];
          if (!pairMap.has(key)) {
            pairMap.set(key, {
              aSlug: pair[0],
              bSlug: pair[1],
              mentions: 0,
              contexts: new Set(),
            });
          }
          const rec = pairMap.get(key);
          rec.mentions += Number(target.mentions || 0);
          rec.contexts.add(context);
        });
      });
    });

    state.edges = Array.from(pairMap.values())
      .map((edge) => {
        const a = state.memberBySlug.get(edge.aSlug);
        const b = state.memberBySlug.get(edge.bSlug);
        return {
          ...edge,
          aName: (a && a.name) || edge.aSlug,
          bName: (b && b.name) || edge.bSlug,
          contexts: Array.from(edge.contexts.values()).sort(),
        };
      })
      .sort((a, b) => b.mentions - a.mentions || a.aName.localeCompare(b.aName));
  }

  function renderStats() {
    const categories = (state.network && state.network.categories) || {};
    const connected = state.members.filter((m) => m.connectionCount > 0).length;
    const withPages = state.members.filter((m) => !!m.pagePath).length;
    const withProfiles = state.members.filter((m) => !!m.profilePath).length;
    const withBuckets = state.members.filter((m) => !!m.bucketPath).length;
    const totalMentions = state.edges.reduce((sum, edge) => sum + Number(edge.mentions || 0), 0);

    const stats = [
      ["Cast Members", state.members.length],
      ["Categories", Object.keys(categories).length],
      ["Connection Pairs", state.edges.length],
      ["Connected Members", connected],
      ["Total Pair Mentions", totalMentions],
      ["Cast Pages Linked", withPages],
      ["Profiles Linked", withProfiles],
      ["People Buckets Linked", withBuckets],
    ];

    $("summaryStats").innerHTML = stats
      .map(
        ([label, value]) =>
          '<div class="big-stat"><div class="n">' + formatNumber(value) + '</div><div class="l">' + escapeHtml(label) + "</div></div>"
      )
      .join("");
  }

  function renderCategoryBars() {
    const categories = (state.network && state.network.categories) || {};
    const rows = Object.entries(categories).map(([code, meta]) => ({
      code,
      label: meta.label || code,
      count: Number(meta.count || 0),
      color: meta.color || "",
    }));
    rows.sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
    const max = Math.max(...rows.map((r) => r.count), 1);

    $("categoryBars").innerHTML = rows
      .map((row) => {
        const colorStyle = row.color ? "background:" + escapeHtml(row.color) : "";
        return (
          '<div class="cat-row">' +
          '<span class="cat-name">' +
          escapeHtml(row.label) +
          "</span>" +
          '<span class="cat-track"><span class="cat-fill" style="width:' +
          ((row.count / max) * 100).toFixed(2) +
          "%;" +
          colorStyle +
          '"></span></span>' +
          '<span class="cat-count">' +
          formatNumber(row.count) +
          "</span>" +
          "</div>"
        );
      })
      .join("");
  }

  function actionButton(path, text, extraClass) {
    if (!path) return '<button class="btn" disabled>' + escapeHtml(text) + "</button>";
    return (
      '<button class="btn ' +
      (extraClass || "") +
      '" data-open-path="' +
      escapeHtml(path) +
      '">' +
      escapeHtml(text) +
      "</button>"
    );
  }

  function memberCardHtml(member) {
    const tags = [
      "Connections: " + formatNumber(member.connectionCount),
      "Mentions: " + formatNumber(member.connectionMentions),
    ];
    if (member.topicMentionCount > 0) tags.push("Topic refs: " + formatNumber(member.topicMentionCount));

    return (
      '<article class="member-card">' +
      '<div class="member-name">' +
      escapeHtml(member.name) +
      "</div>" +
      '<div class="member-cat">' +
      escapeHtml(member.categoryLabel) +
      "</div>" +
      '<p class="member-summary">' +
      escapeHtml(member.summary) +
      "</p>" +
      '<div class="mini-tags">' +
      tags.map((tag) => '<span class="chip">' + escapeHtml(tag) + "</span>").join("") +
      "</div>" +
      '<div class="member-actions">' +
      actionButton(member.pagePath, "Open Cast Page", "primary") +
      actionButton(member.profilePath, "Open Profile", "") +
      actionButton(member.bucketPath, "Open Email Bucket", "") +
      '<button class="btn" data-member-focus="' +
      escapeHtml(member.slug) +
      '">Focus Connections</button>' +
      "</div>" +
      "</article>"
    );
  }

  function renderTopConnected() {
    const top = state.members
      .slice()
      .sort((a, b) => b.connectionCount - a.connectionCount || b.connectionMentions - a.connectionMentions || a.name.localeCompare(b.name))
      .slice(0, 18);
    $("topConnected").innerHTML = top.map((member) => memberCardHtml(member).replace("member-card", "mini-card")).join("");
    bindPathButtons($("topConnected"));
  }

  function populateDirectoryFilters() {
    const categories = (state.network && state.network.categories) || {};
    const categorySelect = $("memberCategory");
    categorySelect.innerHTML = '<option value="">All categories</option>';
    Object.keys(categories)
      .sort()
      .forEach((code) => {
        const option = document.createElement("option");
        option.value = code;
        option.textContent = categories[code].label || code;
        categorySelect.appendChild(option);
      });
  }

  function applyMemberFilters() {
    const q = String($("memberSearch").value || "").toLowerCase().trim();
    const cat = String($("memberCategory").value || "");
    const sort = String($("memberSort").value || "name");

    let filtered = state.members.filter((member) => {
      if (cat && member.category !== cat) return false;
      if (!q) return true;
      const hay = (member.name + " " + member.categoryLabel + " " + member.summary).toLowerCase();
      return hay.includes(q);
    });

    if (sort === "connections") {
      filtered.sort((a, b) => b.connectionCount - a.connectionCount || b.connectionMentions - a.connectionMentions || a.name.localeCompare(b.name));
    } else if (sort === "mentions") {
      filtered.sort((a, b) => b.connectionMentions - a.connectionMentions || b.connectionCount - a.connectionCount || a.name.localeCompare(b.name));
    } else if (sort === "category") {
      filtered.sort((a, b) => a.categoryLabel.localeCompare(b.categoryLabel) || a.name.localeCompare(b.name));
    } else {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    state.filteredMembers = filtered;
    renderMemberList();
  }

  function renderMemberList() {
    $("memberMeta").textContent = formatNumber(state.filteredMembers.length) + " cast member(s) matched";
    $("memberList").innerHTML = state.filteredMembers.length
      ? state.filteredMembers.map((member) => memberCardHtml(member)).join("")
      : '<p class="result-meta">No cast members match this filter.</p>';

    bindPathButtons($("memberList"));
    bindFocusButtons();
  }

  function applyEdgeFilters() {
    const q = String($("edgeSearch").value || "").toLowerCase().trim();
    const minMentions = Number($("edgeMin").value || 1);

    const filtered = state.edges.filter((edge) => {
      if (edge.mentions < minMentions) return false;
      if (!q) return true;
      const hay = (edge.aName + " " + edge.bName).toLowerCase();
      return hay.includes(q);
    });

    state.filteredEdges = filtered;
    renderEdges();
  }

  function renderEdges() {
    $("edgeMeta").textContent = formatNumber(state.filteredEdges.length) + " pair(s) matched";
    $("edgeRows").innerHTML = state.filteredEdges.length
      ? state.filteredEdges
          .slice(0, 2000)
          .map((edge) => {
            const left = state.memberBySlug.get(edge.aSlug);
            const right = state.memberBySlug.get(edge.bSlug);
            const leftPath = (left && left.pagePath) || (left && left.profilePath) || "";
            const rightPath = (right && right.pagePath) || (right && right.profilePath) || "";
            return (
              "<tr>" +
              '<td><div class="pair">' +
              escapeHtml(edge.aName) +
              " + " +
              escapeHtml(edge.bName) +
              '</div><div class="contexts">' +
              escapeHtml(edge.contexts.join(", ")) +
              "</div></td>" +
              "<td>" +
              formatNumber(edge.mentions) +
              "</td>" +
              "<td>" +
              escapeHtml((left && left.categoryLabel) || "-") +
              " / " +
              escapeHtml((right && right.categoryLabel) || "-") +
              "</td>" +
              "<td>" +
              (leftPath ? '<button class="btn" data-open-path="' + escapeHtml(leftPath) + '">' + escapeHtml(edge.aName) + "</button>" : "") +
              (rightPath ? '<button class="btn" data-open-path="' + escapeHtml(rightPath) + '" style="margin-left:.35rem">' + escapeHtml(edge.bName) + "</button>" : "") +
              "</td>" +
              "</tr>"
            );
          })
          .join("")
      : '<tr><td colspan="4" style="color:var(--muted)">No connection pairs match this filter.</td></tr>';

    bindPathButtons($("edgeRows"));
  }

  function bindPathButtons(scope) {
    if (!scope) return;
    scope.querySelectorAll("[data-open-path]").forEach((button) => {
      button.addEventListener("click", () => openDoc(button.getAttribute("data-open-path")));
    });
  }

  function bindInlineLinks(scope, currentPath) {
    if (!scope) return;
    scope.querySelectorAll("a[data-inline-link='1']").forEach((anchor) => {
      anchor.addEventListener("click", (event) => {
        const href = anchor.getAttribute("href") || "";
        if (isExternalHref(href)) return;

        const resolved = resolveInternalPath(currentPath, href);
        if (!resolved) return;

        event.preventDefault();
        const known = resolveKnownPath(resolved);
        if (known) {
          openDoc(known);
          return;
        }
        showMissingDoc(resolved);
      });
    });
  }

  function bindFocusButtons() {
    $("memberList").querySelectorAll("[data-member-focus]").forEach((button) => {
      button.addEventListener("click", () => {
        const slug = button.getAttribute("data-member-focus");
        const member = state.memberBySlug.get(slug);
        if (!member) return;
        $("edgeSearch").value = member.name;
        switchTab("connections");
        applyEdgeFilters();
      });
    });
  }

  function switchTab(tabKey) {
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.tab === tabKey);
    });
    document.querySelectorAll(".tab-content").forEach((panel) => {
      panel.classList.toggle("active", panel.id === "tab-" + tabKey);
    });
  }

  function bindTabs() {
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => switchTab(btn.dataset.tab));
    });
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
        const token = "@@CODE" + codeTokens.length + "@@";
        codeTokens.push("<code>" + code + "</code>");
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

    lines.forEach((raw) => {
      const line = raw || "";

      if (line.startsWith("```")) {
        closeLists();
        if (!inCode) {
          inCode = true;
          codeBuf = [];
        } else {
          out.push("<pre><code>" + escapeHtml(codeBuf.join("\n")) + "</code></pre>");
          inCode = false;
          codeBuf = [];
        }
        return;
      }

      if (inCode) {
        codeBuf.push(line);
        return;
      }

      const heading = line.match(/^(#{1,4})\s+(.+)$/);
      if (heading) {
        closeLists();
        const level = heading[1].length;
        out.push("<h" + level + ">" + inline(heading[2]) + "</h" + level + ">");
        return;
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
        out.push("<li>" + inline(ul[1]) + "</li>");
        return;
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
        out.push("<li>" + inline(ol[1]) + "</li>");
        return;
      }

      const quote = line.match(/^\s*>\s?(.*)$/);
      if (quote) {
        closeLists();
        out.push("<blockquote>" + inline(quote[1]) + "</blockquote>");
        return;
      }

      if (!line.trim()) {
        closeLists();
        return;
      }

      closeLists();
      out.push("<p>" + inline(line) + "</p>");
    });

    if (inCode) {
      out.push("<pre><code>" + escapeHtml(codeBuf.join("\n")) + "</code></pre>");
    }
    closeLists();
    return out.join("\n");
  }

  function showMissingDoc(path) {
    const overlay = $("viewerOverlay");
    const body = $("viewerBody");
    if (!overlay || !body) return;
    const clean = normalizePath(path);
    state.viewerPath = clean;
    updateViewerNeighborControls(clean);
    overlay.classList.add("open");
    body.innerHTML =
      '<p style="color:#ffcf8a">File is referenced but not included in this public bundle:<br><code>' +
      escapeHtml(clean) +
      "</code></p>" +
      '<p style="color:var(--muted)">This link exists in source markdown, but the target file was not part of the published subset.</p>';
  }

  async function openNeighborDocs() {
    const overlay = $("viewerOverlay");
    const body = $("viewerBody");
    if (!overlay || !body) return;

    const basePath = normalizePath(state.viewerPath || "");
    const parsed = parseNumberedPath(basePath);
    if (!parsed) {
      updateViewerNeighborControls(basePath);
      return;
    }

    const windowSize = sanitizeNeighborWindow(state.viewerNeighborWindow);
    state.viewerNeighborWindow = windowSize;

    const targets = collectNeighborTargets(basePath, windowSize);
    const hasAnyNeighbor = targets.some((entry) => entry.delta !== 0 && !!entry.path);
    if (!hasAnyNeighbor) {
      body.innerHTML =
        '<p style="color:var(--muted)">No nearby numbered files were found in this public bundle for +/-' +
        escapeHtml(windowSize) +
        ".</p>";
      updateViewerNeighborControls(basePath);
      return;
    }

    overlay.classList.add("open");
    const requestToken = ++state.viewerRequestToken;
    body.innerHTML =
      '<p style="color:var(--muted)">Loading +/-' +
      escapeHtml(windowSize) +
      " neighbors around <code>" +
      escapeHtml(basePath) +
      "</code>...</p>";

    const loaded = await Promise.all(
      targets.map(async (entry) => {
        if (!entry.path) {
          return { ...entry, status: "missing", text: "" };
        }
        try {
          const response = await fetch(pathToFetchUrl(entry.path), { cache: "no-store" });
          if (!response.ok) {
            return {
              ...entry,
              status: response.status === 404 ? "missing" : "error",
              text: "",
              error: "HTTP " + response.status,
            };
          }
          const text = await response.text();
          return { ...entry, status: "ok", text };
        } catch (err) {
          return {
            ...entry,
            status: "error",
            text: "",
            error: err && err.message ? err.message : String(err),
          };
        }
      })
    );

    if (requestToken !== state.viewerRequestToken) return;

    const html = [];
    html.push('<div class="neighbor-pack">');
    html.push('<div class="neighbor-pack-head">');
    html.push(
      '<button class="btn primary" data-open-path="' +
        escapeHtml(basePath) +
        '">Back To Current Document</button>'
    );
    html.push(
      '<span class="neighbor-pack-meta">Context window +/-' +
        escapeHtml(windowSize) +
        " around <code>" +
        escapeHtml(basePath) +
        "</code></span>"
    );
    html.push("</div>");

    loaded.forEach((entry) => {
      const headingPath = entry.path || entry.attemptedPath || "";
      html.push(
        '<section class="neighbor-doc" data-neighbor-doc-path="' +
          escapeHtml(entry.path || "") +
          '">'
      );
      html.push('<div class="neighbor-doc-head">');
      html.push('<span class="chip">Offset ' + escapeHtml(neighborDeltaLabel(entry.delta)) + "</span>");
      html.push('<span class="neighbor-doc-id">ID ' + escapeHtml(String(entry.id)) + "</span>");
      html.push('<code>' + escapeHtml(headingPath || "(missing)") + "</code>");
      if (entry.path) {
        html.push(
          '<button class="btn" data-open-path="' + escapeHtml(entry.path) + '">Open Only</button>'
        );
      }
      html.push("</div>");

      if (entry.status === "ok") {
        html.push('<div class="neighbor-doc-body">');
        html.push(markdownToHtml(entry.text || ""));
        html.push("</div>");
      } else if (entry.status === "missing") {
        html.push(
          '<p class="neighbor-doc-note">This adjacent ID is referenced by numbering but is not included in this public bundle.</p>'
        );
      } else {
        html.push(
          '<p class="neighbor-doc-note">Could not load this adjacent file: ' +
            escapeHtml(entry.error || "unknown error") +
            "</p>"
        );
      }
      html.push("</section>");
    });

    html.push("</div>");
    body.innerHTML = html.join("");
    bindPathButtons(body);
    body.querySelectorAll("[data-neighbor-doc-path]").forEach((section) => {
      const sectionPath = section.getAttribute("data-neighbor-doc-path") || "";
      if (!sectionPath) return;
      bindInlineLinks(section, sectionPath);
    });
    updateViewerNeighborControls(basePath);
  }

  async function openDoc(path) {
    const overlay = $("viewerOverlay");
    const body = $("viewerBody");
    if (!overlay || !body) return;

    const requestToken = ++state.viewerRequestToken;
    const clean = resolveKnownPath(path) || normalizePath(path);
    state.viewerPath = clean;
    updateViewerNeighborControls(clean);
    overlay.classList.add("open");
    body.innerHTML = '<p style="color:var(--muted)">Loading ' + escapeHtml(clean) + "...</p>";

    try {
      const response = await fetch(pathToFetchUrl(clean), { cache: "no-store" });
      if (requestToken !== state.viewerRequestToken) return;
      if (!response.ok) {
        if (response.status === 404) {
          showMissingDoc(clean);
          return;
        }
        throw new Error("HTTP " + response.status);
      }
      const text = await response.text();
      if (requestToken !== state.viewerRequestToken) return;
      body.innerHTML = markdownToHtml(text);
      bindInlineLinks(body, clean);
    } catch (err) {
      if (requestToken !== state.viewerRequestToken) return;
      body.innerHTML =
        '<p style="color:#ff7a7a">Could not load file: <code>' +
        escapeHtml(clean) +
        "</code><br>" +
        escapeHtml(err && err.message ? err.message : String(err)) +
        "</p>";
    }
  }

  function closeDoc() {
    state.viewerRequestToken += 1;
    $("viewerOverlay").classList.remove("open");
  }

  function bindControls() {
    $("memberSearch").addEventListener("input", applyMemberFilters);
    $("memberCategory").addEventListener("change", applyMemberFilters);
    $("memberSort").addEventListener("change", applyMemberFilters);
    $("edgeSearch").addEventListener("input", applyEdgeFilters);
    $("edgeMin").addEventListener("change", applyEdgeFilters);

    const neighborWindow = $("viewerNeighborWindow");
    if (neighborWindow) {
      neighborWindow.addEventListener("change", () => {
        state.viewerNeighborWindow = sanitizeNeighborWindow(neighborWindow.value);
        updateViewerNeighborControls(state.viewerPath);
      });
    }

    const neighborsButton = $("viewerNeighborsBtn");
    if (neighborsButton) {
      neighborsButton.addEventListener("click", () => {
        openNeighborDocs();
      });
    }

    const overlay = $("viewerOverlay");
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) closeDoc();
    });

    updateViewerNeighborControls("");
  }

  async function loadData() {
    const [networkResp, bundleResp] = await Promise.all([
      fetch("./content/cast/cast-network.json", { cache: "no-store" }),
      fetch("./data/public-data.json", { cache: "no-store" }),
    ]);

    if (!networkResp.ok) throw new Error("Failed to load cast network JSON");
    if (!bundleResp.ok) throw new Error("Failed to load public-data JSON");

    state.network = await networkResp.json();
    state.bundle = await bundleResp.json();
    indexAvailablePaths();
  }

  async function boot() {
    try {
      await loadData();
      buildLinkMaps();
      buildMemberRecords();
      buildEdgeRecords();
      bindTabs();
      bindControls();
      populateDirectoryFilters();
      renderStats();
      renderCategoryBars();
      renderTopConnected();
      applyMemberFilters();
      applyEdgeFilters();
    } catch (err) {
      document.body.innerHTML +=
        '<p style="padding:1rem;color:#ff7a7a;text-align:center">Failed to load CAST hub data: ' +
        escapeHtml(err && err.message ? err.message : String(err)) +
        "</p>";
    }
  }

  window.openDoc = openDoc;
  window.closeDoc = closeDoc;

  document.addEventListener("DOMContentLoaded", boot);
})();
