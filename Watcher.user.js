// ==UserScript==
// @name         Watcher by Rudeboy™
// @namespace    https://rud3boy.vercel.app
// @version      3.2.0
// @description  Adds Watcher buttons to IMDB, Letterboxd, Trakt, JustWatch, MDBList, iCheckMovies, TheTVDB, Criticker, Metacritic, TMDb + copy magnet & open Watcher
// @author       Rudeboy™
// @license      MIT
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://rud3boy.vercel.app/Watcher.user.js
// @updateURL   https://rud3boy.vercel.app/Watcher.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Load Bangers font
  if (!document.getElementById("watcher-bangers-font")) {
    const link = document.createElement("link");
    link.id = "watcher-bangers-font";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Bangers&display=swap";
    document.head.appendChild(link);
  }

  const WATCHER_HOST = "https://rud3boy.vercel.app/watcher";
  const BTN_LABEL = "Watcher🔎";
  const MAGNET_BTN_LABEL = "Watcher🧲";

  function buildWatcherUrl(imdbId, type = "movie") {
    const t = type === "tv" || type === "series" || type === "show" ? "tv" : "movie";
    return `${WATCHER_HOST}?imdb=${imdbId}&type=${t}`;
  }

  function openInWatcher(url) {
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (_) {
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
        return true;
      } catch (_) {
        return false;
      }
    }
  }

  function createButton(text, url) {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.setAttribute("data-watcher-btn", "true");
    btn.style.cssText = `
      margin-left: 6px;
      padding: 4px 10px;
      border: none;
      border-radius: 4px;
      background: #7c3aed;
      color: #fff;
      cursor: pointer;
      font-family: 'Bangers', system-ui, sans-serif;
      font-size: 15px;
      letter-spacing: 0.5px;
      vertical-align: middle;
      transition: background 0.15s, transform 0.1s;
      line-height: 1.2;
    `;
    btn.onmouseover = () => {
      btn.style.background = "#10b981";
      btn.style.transform = "scale(1.05)";
    };
    btn.onmouseout = () => {
      btn.style.background = "#7c3aed";
      btn.style.transform = "scale(1)";
    };
    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      openInWatcher(url);
    };
    return btn;
  }

  /**
   * SPA-safe insert: only skip if *this specific element* already has a Watcher button.
   * When the framework replaces the title node, the new node has no button, so we re-add.
   */
  function ensureButtonOn(el, label, url) {
    if (!el) return false;
    if (el.querySelector("button[data-watcher-btn]")) return true; // already present on this node
    el.appendChild(createButton(label, url));
    return true;
  }

  /** Multi-strategy IMDb ID finder */
  function findImdbId() {
    // 1. Classic external link
    const link =
      document.querySelector('a[href*="imdb.com/title/"]') ||
      document.querySelector('a[href*="imdb.com/Title/"]') ||
      document.querySelector('a[href*="//imdb.com/title/"]');
    if (link) {
      const m = link.href.match(/tt\d+/i);
      if (m) return m[0].toLowerCase();
    }

    // 2. Common JSON / script patterns (JustWatch, Metacritic, etc.)
    const scripts = document.querySelectorAll("script:not([src])");
    for (const s of scripts) {
      const t = s.textContent || "";
      const m =
        t.match(/"imdbId"\s*:\s*"(tt\d+)"/i) ||
        t.match(/"imdb_id"\s*:\s*"(tt\d+)"/i) ||
        t.match(/"imdb"\s*:\s*"(tt\d+)"/i) ||
        t.match(/imdb\.com\/title\/(tt\d+)/i) ||
        t.match(/externalIds[^}]*imdb[^"]*"(tt\d+)"/i);
      if (m) return (m[1] || m[0]).toLowerCase().replace(/^.*?(tt\d+)/i, "$1");
    }

    // 3. data attributes
    const dataEl = document.querySelector("[data-imdb], [data-imdb-id], [data-imdbid]");
    if (dataEl) {
      const v =
        dataEl.getAttribute("data-imdb") ||
        dataEl.getAttribute("data-imdb-id") ||
        dataEl.getAttribute("data-imdbid");
      if (v && /tt\d+/i.test(v)) return v.match(/tt\d+/i)[0].toLowerCase();
    }

    // 4. Any ttXXXXXXX in the HTML (last resort – usually the page’s own ID)
    const html = document.documentElement.innerHTML;
    const all = html.match(/tt\d{7,}/gi) || [];
    if (all.length) return all[0].toLowerCase();

    return null;
  }

  // ── Site helpers ──────────────────────────────────────────

  function addButtonsToIMDBSingleTitle() {
    const imdbId = location.pathname.match(/\/title\/(tt\d+)/)?.[1];
    if (!imdbId) return;
    const isTV =
      !!document.querySelector(
        '[data-testid="hero-title-block__series-link"], a[href*="/title/"][href*="/episodes"]'
      ) ||
      /TV Series|TV Mini Series|TV Episode/i.test(
        document.body.innerText.slice(0, 3000)
      );
    const target =
      document.querySelector("h1") ||
      document.querySelector("[data-testid='hero-title-block__title']");
    ensureButtonOn(target, BTN_LABEL, buildWatcherUrl(imdbId, isTV ? "tv" : "movie"));
  }

  function addButtonsToLetterboxdSingleTitle() {
    const imdbId =
      document
        .querySelector("a[data-track-action='IMDb']")
        ?.href?.match(/tt\d+/)?.[0] || findImdbId();
    if (!imdbId) return;
    const target =
      document.querySelector("h1.headline-1") || document.querySelector("h1");
    ensureButtonOn(target, BTN_LABEL, buildWatcherUrl(imdbId, "movie"));
  }

  function addButtonsToTraktTVSingleTitle() {
    const imdbId = findImdbId();
    if (!imdbId) return;

    const isTV =
      /^\/shows\//.test(location.pathname) ||
      location.pathname.includes("/shows/");

    const target =
      document.querySelector("h1") ||
      document.querySelector(".mobile-title") ||
      document.querySelector('[class*="title"] h1') ||
      document.querySelector("h2");

    ensureButtonOn(
      target,
      BTN_LABEL,
      buildWatcherUrl(imdbId, isTV ? "tv" : "movie")
    );
  }

  function addButtonsToJustWatchSingleTitle() {
    let imdbId = null;

    document.querySelectorAll("script:not([src])").forEach((s) => {
      if (imdbId) return;
      const t = s.textContent || "";
      const m =
        t.match(/"imdbId"\s*:\s*"(tt\d+)"/i) ||
        t.match(/"imdb_id"\s*:\s*"(tt\d+)"/i) ||
        t.match(/"imdb"\s*:\s*"(tt\d+)"/i) ||
        t.match(/externalIds[^}]*?"imdb"\s*:\s*"(tt\d+)"/i);
      if (m) imdbId = m[1];
    });

    if (!imdbId) imdbId = findImdbId();
    if (!imdbId) return;

    const isTV = /\/tv-show\//.test(location.pathname);
    const target =
      document.querySelector("h1") ||
      document.querySelector('[class*="title"] h1') ||
      document.querySelector("h2");

    ensureButtonOn(
      target,
      BTN_LABEL,
      buildWatcherUrl(imdbId, isTV ? "tv" : "movie")
    );
  }

  function addButtonsToMDBListSingleTitle() {
    const imdbId =
      document
        .querySelector('a[href*="imdb.com/title/"]')
        ?.href?.match(/tt\d+/)?.[0] || findImdbId();
    if (!imdbId) return;
    const isTV = /^\/show\//.test(location.pathname);
    const target =
      document.querySelector("h1") || document.querySelector(".title");
    ensureButtonOn(
      target,
      BTN_LABEL,
      buildWatcherUrl(imdbId, isTV ? "tv" : "movie")
    );
  }

  function addButtonsToiCheckMoviesSingleTitle() {
    const imdbId =
      document
        .querySelector("a.optionIMDB")
        ?.href?.match(/tt\d+/)?.[0] || findImdbId();
    if (!imdbId) return;
    const target = document.querySelector("#movie > h1");
    ensureButtonOn(target, BTN_LABEL, buildWatcherUrl(imdbId, "movie"));
  }

  function addButtonsToiCheckMoviesList() {
    const items = Array.from(
      document.querySelectorAll("ol#itemListMovies > li")
    );

    items.forEach((item) => {
      const imdbId = item
        .querySelector("a.optionIMDB")
        ?.href?.match(/tt\d+/)?.[0];
      if (!imdbId) return;

      const target = item.querySelector("h2 a") || item.querySelector("h2");
      if (!target) return;
      ensureButtonOn(target, BTN_LABEL, buildWatcherUrl(imdbId, "movie"));
    });
  }

  function addButtonsToTheTVDBSingleTitle() {
    const target =
      document.querySelector("h1#series_title") || document.querySelector("h1");
    if (!target) return;

    const imdbId =
      document
        .querySelector('a[href*="imdb.com/title/"]')
        ?.href?.match(/tt\d+/)?.[0] || findImdbId();
    if (!imdbId) return;

    const isTV = /^\/series\//.test(location.pathname);
    ensureButtonOn(
      target,
      BTN_LABEL,
      buildWatcherUrl(imdbId, isTV ? "tv" : "movie")
    );
  }

  function addButtonsToCritickerSingleTitle() {
    const imdbId =
      document
        .querySelector('a[href*="imdb.com/title/"]')
        ?.href?.match(/tt\d+/)?.[0] || findImdbId();
    if (!imdbId) return;
    const target = document.querySelector("h1");
    ensureButtonOn(target, BTN_LABEL, buildWatcherUrl(imdbId, "movie"));
  }

  function addButtonsToMetacriticSingleTitle() {
    let imdbId = null;
    document.querySelectorAll("script:not([src])").forEach((s) => {
      if (!imdbId) {
        const match = s.textContent.match(/tt\d{5,}/);
        if (match) imdbId = match[0];
      }
    });
    if (!imdbId) imdbId = findImdbId();
    if (!imdbId) return;
    const isTV = /^\/tv\//.test(location.pathname);
    const target = document.querySelector("h1");
    ensureButtonOn(
      target,
      BTN_LABEL,
      buildWatcherUrl(imdbId, isTV ? "tv" : "movie")
    );
  }

  // TMDb
  function addButtonsToTMDbSingleTitle() {
    const imdbId = findImdbId();
    if (!imdbId) return;

    const isTV = /^\/tv\//.test(location.pathname);
    const target =
      document.querySelector("section.header h2") ||
      document.querySelector(".header h2") ||
      document.querySelector("h2") ||
      document.querySelector("h1");

    ensureButtonOn(
      target,
      BTN_LABEL,
      buildWatcherUrl(imdbId, isTV ? "tv" : "movie")
    );
  }

  // Magnet buttons
  function addMagnetButtons() {
    document.querySelectorAll('a[href^="magnet:?"]').forEach((link) => {
      if (link.hasAttribute("data-watcher-magnet")) return;

      const magnet = link.href;
      const hash = magnet.match(/btih:([a-fA-F0-9]{40}|[a-zA-Z0-9]{32})/i)?.[1];
      if (!hash) return;

      link.setAttribute("data-watcher-magnet", "true");

      const btn = createButton(MAGNET_BTN_LABEL, WATCHER_HOST);
      btn.title = "Copy magnet & open Watcher";

      btn.onclick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const ok = await copyText(magnet);
        if (ok) {
          btn.textContent = "Copied ✓";
          setTimeout(() => (btn.textContent = MAGNET_BTN_LABEL), 1200);
        } else {
          btn.textContent = "Copy failed";
          setTimeout(() => (btn.textContent = MAGNET_BTN_LABEL), 1200);
        }

        openInWatcher(`${WATCHER_HOST}?action=addmagnet`);
      };

      link.parentNode.insertBefore(btn, link.nextSibling);
    });
  }

  /**
   * Continuous SPA-safe observer.
   * Re-runs the injector whenever the DOM changes so buttons that get
   * wiped by framework re-renders are immediately put back.
   */
  function persistentObserver(fn) {
    let scheduled = false;
    const run = () => {
      scheduled = false;
      try {
        fn();
      } catch (_) {}
    };
    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(run);
    };

    const obs = new MutationObserver(schedule);
    obs.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    // Also poll lightly for a few seconds while the SPA settles
    const intervals = [0, 300, 800, 1500, 2500, 4000, 6000];
    intervals.forEach((d) => setTimeout(run, d));
  }

  // ── Main ──────────────────────────────────────────────────

  addMagnetButtons();
  // Keep magnet buttons alive too on dynamic pages
  persistentObserver(addMagnetButtons);

  const host = location.hostname.replace(/^www\./, "");

  if (host === "imdb.com" || host === "m.imdb.com") {
    if (/^\/title\//.test(location.pathname)) {
      persistentObserver(addButtonsToIMDBSingleTitle);
    }
  } else if (host === "letterboxd.com") {
    if (/^\/film\//.test(location.pathname)) {
      persistentObserver(addButtonsToLetterboxdSingleTitle);
    }
  } else if (host === "trakt.tv" || host === "app.trakt.tv") {
    if (/^\/(shows|movies)\//.test(location.pathname)) {
      persistentObserver(addButtonsToTraktTVSingleTitle);
    }
  } else if (host === "justwatch.com") {
    if (/\/(movie|tv-show)\//.test(location.pathname)) {
      persistentObserver(addButtonsToJustWatchSingleTitle);
    }
  } else if (host === "mdblist.com") {
    if (/^\/(movie|show)\//.test(location.pathname)) {
      persistentObserver(addButtonsToMDBListSingleTitle);
    }
  } else if (host === "icheckmovies.com") {
    if (/^\/movies\//.test(location.pathname)) {
      persistentObserver(addButtonsToiCheckMoviesSingleTitle);
    } else if (/^\/lists\//.test(location.pathname)) {
      persistentObserver(addButtonsToiCheckMoviesList);
    }
  } else if (host === "thetvdb.com") {
    if (/^\/(movies|series)\//.test(location.pathname)) {
      persistentObserver(addButtonsToTheTVDBSingleTitle);
    }
  } else if (host === "criticker.com") {
    if (/^\/film\//.test(location.pathname)) {
      persistentObserver(addButtonsToCritickerSingleTitle);
    }
  } else if (host === "metacritic.com") {
    if (/^\/(movie|tv)\//.test(location.pathname)) {
      persistentObserver(addButtonsToMetacriticSingleTitle);
    }
  } else if (host === "themoviedb.org") {
    if (/^\/(movie|tv)\//.test(location.pathname)) {
      persistentObserver(addButtonsToTMDbSingleTitle);
    }
  }
})();