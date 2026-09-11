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

  function addButtonToElement(el, label, url) {
    if (!el || el.hasAttribute("data-watcher-btn")) return;
    el.setAttribute("data-watcher-btn", "true");
    el.appendChild(createButton(label, url));
  }

  /** Try multiple strategies to find an IMDb tt ID on the current page */
  function findImdbId() {
    // 1. Classic external link
    const link =
      document.querySelector('a[href*="imdb.com/title/"]') ||
      document.querySelector('a[href*="imdb.com/Title/"]');
    if (link) {
      const m = link.href.match(/tt\d+/i);
      if (m) return m[0].toLowerCase();
    }

    // 2. Common JSON / script patterns
    const scripts = document.querySelectorAll("script:not([src])");
    for (const s of scripts) {
      const t = s.textContent || "";
      let m =
        t.match(/"imdbId"\s*:\s*"(tt\d+)"/i) ||
        t.match(/"imdb_id"\s*:\s*"(tt\d+)"/i) ||
        t.match(/"imdb"\s*:\s*"(tt\d+)"/i) ||
        t.match(/imdb\.com\/title\/(tt\d+)/i);
      if (m) return m[1].toLowerCase();
    }

    // 3. Any ttXXXXXXX that looks like an IMDb ID in the HTML
    const html = document.documentElement.innerHTML;
    const all = html.match(/tt\d{7,}/gi) || [];
    // Prefer the most common / first reasonable one (usually the page title)
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
    if (target)
      addButtonToElement(
        target,
        BTN_LABEL,
        buildWatcherUrl(imdbId, isTV ? "tv" : "movie")
      );
  }

  function addButtonsToLetterboxdSingleTitle() {
    const imdbId =
      document
        .querySelector("a[data-track-action='IMDb']")
        ?.href?.match(/tt\d+/)?.[0] || findImdbId();
    if (!imdbId) return;
    const target =
      document.querySelector("h1.headline-1") || document.querySelector("h1");
    if (target)
      addButtonToElement(target, BTN_LABEL, buildWatcherUrl(imdbId, "movie"));
  }

  function addButtonsToTraktTVSingleTitle() {
    const imdbId = findImdbId();
    if (!imdbId) return;

    const isTV =
      /^\/shows\//.test(location.pathname) ||
      /\/shows\//.test(location.pathname);

    const target =
      document.querySelector("h1") ||
      document.querySelector(".mobile-title") ||
      document.querySelector('[class*="title"] h1') ||
      document.querySelector("h2");

    if (target)
      addButtonToElement(
        target,
        BTN_LABEL,
        buildWatcherUrl(imdbId, isTV ? "tv" : "movie")
      );
  }

  function addButtonsToJustWatchSingleTitle() {
    let imdbId = null;

    // Prefer structured data in scripts
    document.querySelectorAll("script:not([src])").forEach((s) => {
      if (imdbId) return;
      const t = s.textContent || "";
      const m =
        t.match(/"imdbId"\s*:\s*"(tt\d+)"/i) ||
        t.match(/"imdb_id"\s*:\s*"(tt\d+)"/i) ||
        t.match(/"imdb"\s*:\s*"(tt\d+)"/i);
      if (m) imdbId = m[1];
    });

    if (!imdbId) imdbId = findImdbId();
    if (!imdbId) return;

    const isTV = /\/tv-show\//.test(location.pathname);
    const target =
      document.querySelector("h1") ||
      document.querySelector('[class*="title"] h1') ||
      document.querySelector("h2");

    if (target)
      addButtonToElement(
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
    if (target)
      addButtonToElement(
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
    if (target)
      addButtonToElement(target, BTN_LABEL, buildWatcherUrl(imdbId, "movie"));
  }

  function addButtonsToiCheckMoviesList() {
    const items = Array.from(
      document.querySelectorAll("ol#itemListMovies > li")
    ).filter((item) => !item.hasAttribute("data-watcher-btn"));

    items.forEach((item) => {
      const imdbId = item
        .querySelector("a.optionIMDB")
        ?.href?.match(/tt\d+/)?.[0];
      if (!imdbId) return;

      const target = item.querySelector("h2 a") || item.querySelector("h2");
      if (!target) return;

      item.setAttribute("data-watcher-btn", "true");
      addButtonToElement(target, BTN_LABEL, buildWatcherUrl(imdbId, "movie"));
    });
  }

  // TheTVDB
  function addButtonsToTheTVDBSingleTitle() {
    const target =
      document.querySelector("h1#series_title") || document.querySelector("h1");
    if (!target || target.hasAttribute("data-watcher-btn")) return;

    const imdbId =
      document
        .querySelector('a[href*="imdb.com/title/"]')
        ?.href?.match(/tt\d+/)?.[0] || findImdbId();
    if (!imdbId) return;

    const isTV = /^\/series\//.test(location.pathname);
    addButtonToElement(
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
    if (target)
      addButtonToElement(target, BTN_LABEL, buildWatcherUrl(imdbId, "movie"));
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
    if (target)
      addButtonToElement(
        target,
        BTN_LABEL,
        buildWatcherUrl(imdbId, isTV ? "tv" : "movie")
      );
  }

  // TMDb (themoviedb.org)
  function addButtonsToTMDbSingleTitle() {
    const imdbId = findImdbId();
    if (!imdbId) return;

    const isTV = /^\/tv\//.test(location.pathname);
    const target =
      document.querySelector("section.header h2") ||
      document.querySelector(".header h2") ||
      document.querySelector("h2") ||
      document.querySelector("h1");

    if (target)
      addButtonToElement(
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

  function changeObserver(selector, fn) {
    const node = document.querySelector(selector) || document.body;
    const obs = new MutationObserver(() => {
      obs.disconnect();
      fn();
      obs.observe(node, { childList: true, subtree: true });
    });
    obs.observe(node, { childList: true, subtree: true });
  }

  // Light retry helper for SPAs that load data after first paint
  function runWithRetries(fn, delays = [0, 600, 1500, 3000]) {
    delays.forEach((d) => setTimeout(fn, d));
  }

  // ── Main ──────────────────────────────────────────────────

  addMagnetButtons();

  const host = location.hostname.replace(/^www\./, "");

  if (host === "imdb.com" || host === "m.imdb.com") {
    if (/^\/title\//.test(location.pathname)) {
      addButtonsToIMDBSingleTitle();
      changeObserver("body", addButtonsToIMDBSingleTitle);
    }
  } else if (host === "letterboxd.com") {
    if (/^\/film\//.test(location.pathname)) addButtonsToLetterboxdSingleTitle();
  } else if (host === "trakt.tv" || host === "app.trakt.tv") {
    // Support both classic trakt.tv and the new app.trakt.tv SPA
    if (/^\/(shows|movies)\//.test(location.pathname)) {
      runWithRetries(addButtonsToTraktTVSingleTitle);
      changeObserver("body", addButtonsToTraktTVSingleTitle);
    }
  } else if (host === "justwatch.com") {
    if (/\/(movie|tv-show)\//.test(location.pathname)) {
      runWithRetries(addButtonsToJustWatchSingleTitle);
      changeObserver("body", addButtonsToJustWatchSingleTitle);
    }
  } else if (host === "mdblist.com") {
    if (/^\/(movie|show)\//.test(location.pathname))
      addButtonsToMDBListSingleTitle();
  } else if (host === "icheckmovies.com") {
    if (/^\/movies\//.test(location.pathname)) {
      addButtonsToiCheckMoviesSingleTitle();
    } else if (/^\/lists\//.test(location.pathname)) {
      addButtonsToiCheckMoviesList();
    }
  } else if (host === "thetvdb.com") {
    if (/^\/(movies|series)\//.test(location.pathname)) {
      addButtonsToTheTVDBSingleTitle();
      runWithRetries(addButtonsToTheTVDBSingleTitle, [600, 1500]);
    }
  } else if (host === "criticker.com") {
    if (/^\/film\//.test(location.pathname)) {
      addButtonsToCritickerSingleTitle();
    }
  } else if (host === "metacritic.com") {
    if (/^\/(movie|tv)\//.test(location.pathname)) {
      addButtonsToMetacriticSingleTitle();
    }
  } else if (host === "themoviedb.org") {
    if (/^\/(movie|tv)\//.test(location.pathname)) {
      runWithRetries(addButtonsToTMDbSingleTitle);
      changeObserver("body", addButtonsToTMDbSingleTitle);
    }
  }
})();