/* nav.js - shared site navigation, auto-injected */
(function () {
  var current = location.pathname.split("/").pop() || "index.html";

  function getFileName(href) {
    return String(href || "").replace(/^.*\//, "").split("?")[0];
  }

  function linkIsActive(link) {
    if (!link) return false;
    var byHref = link.href && getFileName(link.href) === current;
    var byMatch = link.match && link.match.indexOf(current) !== -1;
    var byPrefix = link.prefix && link.prefix.some(function (p) { return current.indexOf(p) === 0; });
    return !!(byHref || byMatch || byPrefix);
  }

  function itemIsActive(item) {
    var selfActive = linkIsActive(item);
    if (!item.children || !item.children.length) return selfActive;
    var childActive = item.children.some(function (child) { return linkIsActive(child); });
    return selfActive || childActive;
  }

  var items = [
    { label: "Home", href: "./", match: ["index.html", ""] },
    { label: "Hub", href: "./hub.html", match: ["hub.html"] },
    {
      label: "Search",
      href: "./search.html",
      match: ["search.html"],
      children: [
        { label: "Advanced Search", href: "./search.html", match: ["search.html"] },
        { label: "Full-Text OCR Search", href: "./ftx-search.html", match: ["ftx-search.html"] },
        { label: "Official Release Guide", href: "./release-guide.html", match: ["release-guide.html"] }
      ]
    },
    { label: "News", href: "./news.html", match: ["news.html"] },
    { label: "Media", href: "./media.html", match: ["media.html"] },
    { label: "Links", href: "./links.html", match: ["links.html"] },
    {
      label: "Cast",
      href: "./cast.html",
      match: [
        "cast.html", "acosta.html", "andrew.html", "bannon.html", "barr.html", "black.html",
        "bondi.html", "brunel.html", "clinton.html", "dershowitz.html", "dubin.html", "gates.html",
        "graham.html", "groff.html", "israel.html", "kellen.html", "maxwell.html", "musk.html",
        "patel.html", "russia.html", "thomas.html", "trump.html", "victims.html", "wexner.html"
      ],
      children: [
        { label: "Cast Hub", href: "./cast.html" },
        { label: "Ghislaine Maxwell", href: "./maxwell.html" },
        { label: "Jean-Luc Brunel", href: "./brunel.html" },
        { label: "Prince Andrew", href: "./andrew.html" },
        { label: "Sarah Kellen", href: "./kellen.html" },
        { label: "Lesley Groff", href: "./groff.html" },
        { label: "Leon Black", href: "./black.html" },
        { label: "Alan Dershowitz", href: "./dershowitz.html" },
        { label: "William Barr", href: "./barr.html" },
        { label: "Glenn Dubin", href: "./dubin.html" },
        { label: "Donald Trump", href: "./trump.html" },
        { label: "Victims & Accusers", href: "./victims.html" }
      ]
    },
    {
      label: "Images",
      href: "./images.html",
      match: ["images.html", "gallery-picks.html", "epstein-face-matches.html", "handwritten-notes.html"],
      prefix: ["gallery-category-"],
      children: [
        { label: "Image Analysis Hub", href: "./images.html", match: ["images.html"] },
        { label: "Gallery Picks", href: "./gallery-picks.html", match: ["gallery-picks.html"] },
        { label: "Epstein Face Matches", href: "./epstein-face-matches.html", match: ["epstein-face-matches.html"] },
        { label: "Handwritten Notes", href: "./handwritten-notes.html", match: ["handwritten-notes.html"] },
        { label: "People Category Gallery", href: "./gallery-category-person.html", match: ["gallery-category-person.html"] },
        { label: "Epstein Photo Category", href: "./gallery-category-epstein-photos.html", match: ["gallery-category-epstein-photos.html"] },
        { label: "Face Close-Up Gallery", href: "./gallery-category-face-close-up.html", match: ["gallery-category-face-close-up.html"] }
      ]
    },
    { label: "Timeline", href: "./timeline.html", match: ["timeline.html", "master-timeline.html"] },
    { label: "Investigations", href: "./investigations.html", match: ["investigations.html", "investigation-c.html", "analysis.html"] },
    { label: "Flights", href: "./flights.html", match: ["flights.html", "flights-intel.html", "financials.html"] },
    { label: "Map", href: "./map.html", match: ["map.html", "navigator.html"] },
    {
      label: "Explore",
      href: "./hub.html",
      match: ["hub.html"],
      children: [
        { label: "Site Hub", href: "./hub.html" },
        { label: "Connection Map", href: "./map.html" },
        { label: "Mind Map Navigator", href: "./navigator.html" },
        { label: "Case Timeline", href: "./timeline.html" },
        { label: "Master Timeline", href: "./master-timeline.html" },
        { label: "Investigations", href: "./investigations.html" },
        { label: "Investigation C", href: "./investigation-c.html" },
        { label: "Flight Logs", href: "./flights.html" },
        { label: "Legal Filings", href: "./legal-filings.html" },
        { label: "Explosive Documents", href: "./explosive-docs.html" },
        { label: "Deep Sweep", href: "./deep-sweep.html" },
        { label: "Complicity Gradient", href: "./complicity-gradient.html" },
        { label: "News", href: "./news.html" },
        { label: "Links", href: "./links.html" },
        { label: "Media Archive", href: "./media.html" },
        { label: "How This Works", href: "./how-it-works.html" }
      ]
    },
    { label: "How to Help", href: "./contribute.html", match: ["contribute.html"] },
    { label: "GitHub", href: "https://github.com/Eyeswidewoke/PDF-FIles", external: true }
  ];

  var nav = document.createElement("nav");
  nav.className = "site-nav";
  nav.setAttribute("aria-label", "Site navigation");

  var inner = document.createElement("div");
  inner.className = "site-nav-inner";

  var brand = document.createElement("a");
  brand.href = "./";
  brand.className = "site-nav-brand";
  brand.textContent = "THE PDF FILES";
  inner.appendChild(brand);

  var toggle = document.createElement("button");
  toggle.className = "site-nav-toggle";
  toggle.setAttribute("aria-label", "Toggle menu");
  toggle.innerHTML = "<span></span><span></span><span></span>";
  inner.appendChild(toggle);

  var ul = document.createElement("ul");
  ul.className = "site-nav-links";

  items.forEach(function (item) {
    var li = document.createElement("li");
    li.className = "site-nav-item";

    var a = document.createElement("a");
    a.href = item.href;
    a.textContent = item.label;
    if (item.external) {
      a.target = "_blank";
      a.rel = "noopener";
    }

    if (itemIsActive(item)) {
      a.classList.add("active");
    }
    li.appendChild(a);

    if (item.children && item.children.length) {
      li.classList.add("has-menu");
      var menu = document.createElement("div");
      menu.className = "site-nav-menu";

      item.children.forEach(function (child) {
        var ca = document.createElement("a");
        ca.href = child.href;
        ca.textContent = child.label;
        if (linkIsActive(child)) {
          ca.classList.add("active");
        }
        menu.appendChild(ca);
      });

      li.appendChild(menu);
    }

    ul.appendChild(li);
  });

  inner.appendChild(ul);
  nav.appendChild(inner);

  var noise = document.querySelector(".noise");
  if (noise && noise.nextSibling) {
    noise.parentNode.insertBefore(nav, noise.nextSibling);
  } else {
    document.body.insertBefore(nav, document.body.firstChild);
  }

  toggle.addEventListener("click", function () {
    nav.classList.toggle("open");
  });

  var style = document.createElement("style");
  style.textContent = ""
    + ".site-nav{position:sticky;top:0;z-index:9999;background:#1a1310;border-bottom:1px solid #3a2f28;font-family:var(--mono,\"IBM Plex Mono\",monospace)}"
    + ".site-nav-inner{max-width:1320px;margin:0 auto;display:flex;align-items:center;padding:0 1rem;min-height:46px;gap:.5rem}"
    + ".site-nav-brand{color:#c9a44a;font-weight:700;font-size:.82rem;letter-spacing:.06em;text-decoration:none;white-space:nowrap;margin-right:auto}"
    + ".site-nav-brand:hover{color:#e0c070}"
    + ".site-nav-toggle{display:none;background:none;border:none;cursor:pointer;padding:6px;flex-direction:column;gap:4px}"
    + ".site-nav-toggle span{display:block;width:20px;height:2px;background:#c9a44a;border-radius:2px;transition:transform .2s}"
    + ".site-nav-links{display:flex;list-style:none;margin:0;padding:0;gap:.15rem;flex-wrap:wrap;align-items:center}"
    + ".site-nav-item{position:relative}"
    + ".site-nav-links>li>a{display:block;padding:.35rem .55rem;color:#d4c4a8;font-size:.68rem;font-weight:600;text-decoration:none;border-radius:5px;letter-spacing:.02em;white-space:nowrap;transition:background .15s,color .15s}"
    + ".site-nav-links>li>a:hover{background:#2a2118;color:#fff}"
    + ".site-nav-links>li>a.active{background:#3a2a1a;color:#c9a44a}"
    + ".site-nav-item.has-menu>a::after{content:' \\25BE';font-size:.56rem;opacity:.7;margin-left:.25rem}"
    + ".site-nav-menu{display:none;position:absolute;top:100%;left:0;min-width:220px;max-width:320px;background:#211810;border:1px solid #3a2f28;border-radius:8px;padding:.35rem;box-shadow:0 12px 26px rgba(0,0,0,.35)}"
    + ".site-nav-menu a{display:block;padding:.3rem .45rem;border-radius:6px;color:#d4c4a8;font-size:.65rem;font-weight:600;text-decoration:none;line-height:1.34;white-space:normal}"
    + ".site-nav-menu a:hover{background:#2a2118;color:#fff}"
    + ".site-nav-menu a.active{background:#3a2a1a;color:#c9a44a}"
    + ".site-nav-item.has-menu:hover .site-nav-menu,.site-nav-item.has-menu:focus-within .site-nav-menu{display:block}"
    + "@media(max-width:980px){"
    + ".site-nav-toggle{display:flex}"
    + ".site-nav-links{display:none;width:100%;flex-direction:column;padding:.5rem 0}"
    + ".site-nav.open .site-nav-links{display:flex}"
    + ".site-nav-inner{flex-wrap:wrap}"
    + ".site-nav-item{width:100%}"
    + ".site-nav-links>li>a{width:100%}"
    + ".site-nav-item.has-menu>a::after{content:''}"
    + ".site-nav-menu{display:block;position:static;min-width:0;max-width:none;background:transparent;border:none;box-shadow:none;padding:0 0 .25rem .85rem}"
    + ".site-nav-menu a{font-size:.64rem;padding:.2rem .4rem;color:#bfae93}"
    + ".site-nav-menu a:hover{background:#2a2118;color:#fff}"
    + "}";
  document.head.appendChild(style);
})();
