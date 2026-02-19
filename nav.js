/* nav.js - shared site navigation, auto-injected */
(function () {
  if (document.querySelector(".site-nav")) return;

  var current = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  function getFileName(href) {
    return String(href || "")
      .replace(/^.*\//, "")
      .split("?")[0]
      .toLowerCase();
  }

  function linkIsActive(link) {
    if (!link) return false;
    var byHref = !!link.href && getFileName(link.href) === current;
    var byMatch = Array.isArray(link.match) && link.match.map(function (m) { return String(m).toLowerCase(); }).indexOf(current) !== -1;
    var byPrefix = Array.isArray(link.prefix) && link.prefix.some(function (p) { return current.indexOf(String(p).toLowerCase()) === 0; });
    return byHref || byMatch || byPrefix;
  }

  function itemIsActive(item) {
    if (linkIsActive(item)) return true;
    if (!Array.isArray(item.children)) return false;
    return item.children.some(function (child) { return linkIsActive(child); });
  }

  function isTouchOrSmall() {
    return window.matchMedia("(hover: none)").matches || window.matchMedia("(max-width: 980px)").matches;
  }

  var items = [
    {
      label: "Home",
      href: "./",
      match: ["index.html", ""],
      children: [
        { label: "Main Site", href: "./index.html", match: ["index.html", ""] },
        { label: "Site Hub", href: "./hub.html", match: ["hub.html"] },
        { label: "How This Site Works", href: "./how-it-works.html", match: ["how-it-works.html"] }
      ]
    },
    {
      label: "Hub",
      href: "./hub.html",
      match: ["hub.html"],
      children: [
        { label: "Site Hub", href: "./hub.html", match: ["hub.html"] },
        { label: "Official Release Guide", href: "./release-guide.html", match: ["release-guide.html"] },
        { label: "Connection Map", href: "./map.html", match: ["map.html"] },
        { label: "Case Timeline", href: "./timeline.html", match: ["timeline.html"] }
      ]
    },
    {
      label: "Search",
      href: "./search.html",
      match: ["search.html", "ftx-search.html"],
      children: [
        { label: "Advanced Search", href: "./search.html", match: ["search.html"] },
        { label: "Full-Text OCR Search", href: "./ftx-search.html", match: ["ftx-search.html"] },
        { label: "Official Release Guide", href: "./release-guide.html", match: ["release-guide.html"] },
        { label: "Deep Sweep", href: "./deep-sweep.html", match: ["deep-sweep.html"] }
      ]
    },
    {
      label: "News",
      href: "./news.html",
      match: ["news.html"],
      children: [
        { label: "News Feed", href: "./news.html", match: ["news.html"] },
        { label: "Case Timeline", href: "./timeline.html", match: ["timeline.html"] },
        { label: "Master Timeline", href: "./master-timeline.html", match: ["master-timeline.html"] }
      ]
    },
    {
      label: "Media",
      href: "./media.html",
      match: ["media.html"],
      children: [
        { label: "Media Archive", href: "./media.html", match: ["media.html"] },
        { label: "Gallery Picks", href: "./gallery-picks.html", match: ["gallery-picks.html"] },
        { label: "Epstein Face Matches", href: "./epstein-face-matches.html", match: ["epstein-face-matches.html"] },
        { label: "Handwritten Notes", href: "./handwritten-notes.html", match: ["handwritten-notes.html"] }
      ]
    },
    {
      label: "Links",
      href: "./links.html",
      match: ["links.html"],
      children: [
        { label: "Research Links", href: "./links.html", match: ["links.html"] },
        { label: "How This Site Works", href: "./how-it-works.html", match: ["how-it-works.html"] },
        { label: "How to Help", href: "./contribute.html", match: ["contribute.html"] }
      ]
    },
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
        { label: "Cast Hub", href: "./cast.html", match: ["cast.html"] },
        { label: "Ghislaine Maxwell", href: "./maxwell.html", match: ["maxwell.html"] },
        { label: "Jean-Luc Brunel", href: "./brunel.html", match: ["brunel.html"] },
        { label: "Sarah Kellen", href: "./kellen.html", match: ["kellen.html"] },
        { label: "Lesley Groff", href: "./groff.html", match: ["groff.html"] },
        { label: "Leon Black", href: "./black.html", match: ["black.html"] },
        { label: "Prince Andrew", href: "./andrew.html", match: ["andrew.html"] },
        { label: "Alan Dershowitz", href: "./dershowitz.html", match: ["dershowitz.html"] },
        { label: "Glenn Dubin", href: "./dubin.html", match: ["dubin.html"] },
        { label: "William Barr", href: "./barr.html", match: ["barr.html"] },
        { label: "Victims & Accusers", href: "./victims.html", match: ["victims.html"] }
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
        { label: "People Gallery", href: "./gallery-category-person.html", match: ["gallery-category-person.html"] },
        { label: "Epstein Photo Gallery", href: "./gallery-category-epstein-photos.html", match: ["gallery-category-epstein-photos.html"] },
        { label: "Face Close-Up Gallery", href: "./gallery-category-face-close-up.html", match: ["gallery-category-face-close-up.html"] }
      ]
    },
    {
      label: "More",
      href: "#",
      match: [
        "timeline.html", "master-timeline.html",
        "investigations.html", "investigation-c.html", "analysis.html", "depositions.html",
        "legal-filings.html", "explosive-docs.html", "inner-circle.html", "complicity-gradient.html", "deep-sweep.html",
        "flights.html", "flights-intel.html", "financials.html",
        "map.html", "navigator.html",
        "contribute.html"
      ],
      children: [
        { label: "\u2014 Timeline", divider: true },
        { label: "Case Timeline", href: "./timeline.html", match: ["timeline.html"] },
        { label: "Master Timeline", href: "./master-timeline.html", match: ["master-timeline.html"] },
        { label: "\u2014 Investigations", divider: true },
        { label: "Investigations Hub", href: "./investigations.html", match: ["investigations.html"] },
        { label: "Investigation C", href: "./investigation-c.html", match: ["investigation-c.html"] },
        { label: "File Analysis", href: "./analysis.html", match: ["analysis.html"] },
        { label: "Depositions", href: "./depositions.html", match: ["depositions.html"] },
        { label: "Legal Filings", href: "./legal-filings.html", match: ["legal-filings.html"] },
        { label: "Explosive Documents", href: "./explosive-docs.html", match: ["explosive-docs.html"] },
        { label: "Inner Circle", href: "./inner-circle.html", match: ["inner-circle.html"] },
        { label: "Complicity Gradient", href: "./complicity-gradient.html", match: ["complicity-gradient.html"] },
        { label: "Deep Sweep", href: "./deep-sweep.html", match: ["deep-sweep.html"] },
        { label: "\u2014 Flights & Finance", divider: true },
        { label: "Flight Logs", href: "./flights.html", match: ["flights.html"] },
        { label: "Flight Intelligence", href: "./flights-intel.html", match: ["flights-intel.html"] },
        { label: "Financial Intelligence", href: "./financials.html", match: ["financials.html"] },
        { label: "\u2014 Maps & Tools", divider: true },
        { label: "Connection Map", href: "./map.html", match: ["map.html"] },
        { label: "Mind Map Navigator", href: "./navigator.html", match: ["navigator.html"] },
        { label: "How to Help", href: "./contribute.html", match: ["contribute.html"] },
        { label: "GitHub \u2197", href: "https://github.com/Eyeswidewoke/PDF-FIles", external: true }
      ]
    }
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

  var list = document.createElement("ul");
  list.className = "site-nav-links";

  function setExpanded(item, expanded) {
    var link = item.querySelector(".site-nav-link");
    if (!link) return;
    link.setAttribute("aria-expanded", expanded ? "true" : "false");
  }

  function closeAllMenus(exceptItem) {
    var openItems = list.querySelectorAll(".site-nav-item.open");
    openItems.forEach(function (item) {
      if (exceptItem && item === exceptItem) return;
      item.classList.remove("open");
      setExpanded(item, false);
    });
  }

  function openMenu(item) {
    closeAllMenus(item);
    item.classList.add("open");
    setExpanded(item, true);
  }

  function toggleMenu(item) {
    if (item.classList.contains("open")) {
      item.classList.remove("open");
      setExpanded(item, false);
      return;
    }
    openMenu(item);
  }

  function bindWheelContain(menu) {
    menu.addEventListener(
      "wheel",
      function (event) {
        var delta = event.deltaY;
        var atTop = menu.scrollTop <= 0;
        var atBottom = menu.scrollTop + menu.clientHeight >= menu.scrollHeight - 1;
        if ((delta < 0 && atTop) || (delta > 0 && atBottom)) {
          event.preventDefault();
        }
      },
      { passive: false }
    );
  }

  items.forEach(function (item) {
    var li = document.createElement("li");
    li.className = "site-nav-item";

    var link = document.createElement("a");
    link.className = "site-nav-link";
    link.href = item.href;
    link.textContent = item.label;

    if (item.external) {
      link.target = "_blank";
      link.rel = "noopener";
    }

    if (itemIsActive(item)) {
      link.classList.add("active");
    }

    li.appendChild(link);

    if (Array.isArray(item.children) && item.children.length) {
      li.classList.add("has-menu");
      link.setAttribute("aria-haspopup", "true");
      link.setAttribute("aria-expanded", "false");

      var menu = document.createElement("div");
      menu.className = "site-nav-menu";

      item.children.forEach(function (child) {
        if (child.divider) {
          var div = document.createElement("div");
          div.className = "site-nav-divider";
          div.textContent = child.label;
          menu.appendChild(div);
          return;
        }
        var subLink = document.createElement("a");
        subLink.className = "site-nav-sub-link";
        subLink.href = child.href;
        subLink.textContent = child.label;
        if (child.external) {
          subLink.target = "_blank";
          subLink.rel = "noopener";
        }
        if (linkIsActive(child)) {
          subLink.classList.add("active");
          li.classList.add("open");
          link.setAttribute("aria-expanded", "true");
        }
        menu.appendChild(subLink);
      });

      bindWheelContain(menu);
      li.appendChild(menu);

      li.addEventListener("mouseenter", function () {
        if (!isTouchOrSmall()) {
          if (li._closeTimer) { clearTimeout(li._closeTimer); li._closeTimer = null; }
          openMenu(li);
        }
      });

      li.addEventListener("mouseleave", function () {
        if (!isTouchOrSmall()) {
          li._closeTimer = setTimeout(function () {
            li.classList.remove("open");
            setExpanded(li, false);
            li._closeTimer = null;
          }, 120);
        }
      });

      link.addEventListener("click", function (event) {
        if (link.getAttribute("href") === "#") {
          event.preventDefault();
          toggleMenu(li);
          return;
        }
        if (isTouchOrSmall()) {
          if (!li.classList.contains("open")) {
            event.preventDefault();
            openMenu(li);
          }
          return;
        }
      });

      link.addEventListener("keydown", function (event) {
        if (event.key === "ArrowDown") {
          event.preventDefault();
          openMenu(li);
          var firstSub = menu.querySelector("a");
          if (firstSub) firstSub.focus();
        } else if (event.key === "Escape") {
          li.classList.remove("open");
          setExpanded(li, false);
        }
      });
    }

    list.appendChild(li);
  });

  inner.appendChild(list);
  nav.appendChild(inner);

  var noise = document.querySelector(".noise");
  if (noise && noise.parentNode) {
    noise.parentNode.insertBefore(nav, noise.nextSibling);
  } else {
    document.body.insertBefore(nav, document.body.firstChild);
  }

  document.addEventListener("click", function (event) {
    if (!nav.contains(event.target)) {
      closeAllMenus();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeAllMenus();
    }
  });

  window.addEventListener("resize", function () {
    closeAllMenus();
  });

  var style = document.createElement("style");
  style.textContent = `
    .site-nav {
      position: sticky;
      top: 0;
      z-index: 9999;
      background: #1a1310;
      border-bottom: 1px solid #3a2f28;
      box-shadow: 0 8px 22px rgba(0, 0, 0, 0.32);
      font-family: var(--mono, "IBM Plex Mono", monospace);
    }

    .site-nav-inner {
      max-width: 1320px;
      margin: 0 auto;
      padding: 0 1rem;
      min-height: 48px;
      display: flex;
      align-items: center;
      gap: 0.65rem;
    }

    .site-nav-brand {
      color: #c9a44a;
      font-weight: 700;
      font-size: 0.82rem;
      letter-spacing: 0.06em;
      text-decoration: none;
      white-space: nowrap;
      margin-right: 0.2rem;
      flex: 0 0 auto;
    }

    .site-nav-brand:hover,
    .site-nav-brand:focus-visible {
      color: #e8c66f;
    }

    .site-nav-links {
      margin: 0;
      padding: 0;
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.2rem;
      min-width: 0;
    }

    .site-nav-item {
      position: relative;
      flex: 0 0 auto;
    }

    .site-nav-link {
      display: block;
      padding: 0.38rem 0.58rem;
      color: #dbc9ad;
      font-size: 0.68rem;
      font-weight: 600;
      line-height: 1.15;
      text-decoration: none;
      border-radius: 7px;
      letter-spacing: 0.02em;
      white-space: nowrap;
      transition: background 0.14s ease, color 0.14s ease;
    }

    .site-nav-link:hover,
    .site-nav-link:focus-visible {
      color: #fff;
      background: #2b2119;
    }

    .site-nav-link.active {
      color: #d4af37;
      background: #3a2919;
    }

    .site-nav-item.has-menu > .site-nav-link::after {
      content: " v";
      font-size: 0.56rem;
      opacity: 0.78;
      margin-left: 0.2rem;
      vertical-align: 0.02rem;
    }

    .site-nav-menu {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      min-width: 230px;
      max-width: 340px;
      max-height: min(72vh, 460px);
      overflow-y: auto;
      overscroll-behavior: contain;
      background: #211810;
      border: 1px solid #3a2f28;
      border-radius: 10px;
      padding: 0.35rem;
      padding-top: 0.55rem;
      box-shadow: 0 14px 32px rgba(0, 0, 0, 0.38);
    }

    .site-nav-sub-link {
      display: block;
      padding: 0.34rem 0.48rem;
      border-radius: 7px;
      color: #d7c5a9;
      font-size: 0.65rem;
      font-weight: 600;
      line-height: 1.35;
      text-decoration: none;
      white-space: normal;
      word-break: break-word;
      transition: background 0.14s ease, color 0.14s ease;
    }

    .site-nav-sub-link:hover,
    .site-nav-sub-link:focus-visible {
      color: #fff;
      background: #2c221a;
    }

    .site-nav-sub-link.active {
      color: #d4af37;
      background: #3a2919;
    }

    .site-nav-divider {
      padding: 0.32rem 0.48rem 0.12rem;
      font-size: 0.55rem;
      font-weight: 700;
      color: #8a7a6a;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      border-top: 1px solid #3a2f28;
      margin-top: 0.25rem;
      pointer-events: none;
      user-select: none;
    }
    .site-nav-divider:first-child {
      border-top: none;
      margin-top: 0;
    }

    .site-nav-item.has-menu:hover > .site-nav-menu,
    .site-nav-item.has-menu:focus-within > .site-nav-menu,
    .site-nav-item.open > .site-nav-menu {
      display: block;
    }

    .site-nav-item.has-menu:last-child > .site-nav-menu {
      left: auto;
      right: 0;
    }

    @media (max-width: 980px) {
      .site-nav-inner {
        padding: 0 0.7rem;
        gap: 0.45rem;
      }

      .site-nav-brand {
        font-size: 0.78rem;
      }

      .site-nav-links {
        flex-wrap: nowrap;
        overflow-x: auto;
        overscroll-behavior-x: contain;
        scrollbar-width: thin;
        padding: 0.22rem 0;
        max-width: 100%;
      }

      .site-nav-links::-webkit-scrollbar {
        height: 6px;
      }

      .site-nav-links::-webkit-scrollbar-thumb {
        background: #4a3a2f;
        border-radius: 999px;
      }

      .site-nav-link {
        font-size: 0.67rem;
        padding: 0.4rem 0.52rem;
      }

      .site-nav-menu {
        position: fixed;
        left: 0.65rem;
        right: 0.65rem;
        top: 50px;
        max-width: none;
        max-height: 66vh;
      }
    }
  `;

  document.head.appendChild(style);
})();
