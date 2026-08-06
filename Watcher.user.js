// ==UserScript==
// @name         Watcher by Rudeboy™
// @namespace    https://rud3boy.vercel.app
// @version      3.1.2
// @description  Adds Watcher buttons to IMDB, Letterboxd, Trakt, JustWatch, MDBList, iCheckMovies, TheTVDB, Criticker, Metacritic + copy magnet & open Watcher
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

  // Opens a new tab via a real <a> click — the standard, reliable,
  // popup-blocker-safe way to do this from a genuine user gesture.
  // (Previously this also called window.open() 150ms later as a
  // "fallback" — but that fired unconditionally, not just on failure,
  // so on browsers where it wasn't blocked it opened a duplicate tab
  // every time, and on browsers where it WAS blocked (most, since an
  // async setTimeout call falls outside the click's call stack) it was
  // just dead code. Dropped it entirely.)
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
    const imdbId = document
      .querySelector("a[data-track-action='IMDb']")
      ?.href?.match(/tt\d+/)?.[0];
    if (!imdbId) return;
    const target =
      document.querySelector("h1.headline-1") || document.querySelector("h1");
    if (target)
      addButtonToElement(target, BTN_LABEL, buildWatcherUrl(imdbId, "movie"));
  }

  function addButtonsToTraktTVSingleTitle() {
    const imdbId = document
      .querySelector('a[href*="imdb.com/title/"]')
      ?.href?.match(/tt\d+/)?.[0];
    if (!imdbId) return;
    const isTV = /^\/shows\//.test(location.pathname);
    const target =
      document.querySelector("h1") || document.querySelector(".mobile-title");
    if (target)
      addButtonToElement(
        target,
        BTN_LABEL,
        buildWatcherUrl(imdbId, isTV ? "tv" : "movie")
      );
  }

  function addButtonsToJustWatchSingleTitle() {
    let imdbId = null;
    document.querySelectorAll("script:not([src])").forEach((s) => {
      const match = s.textContent.match(/"imdbId":"(tt\d+)"/);
      if (match) imdbId = match[1];
    });
    if (!imdbId) return;
    const isTV = /\/tv-show\//.test(location.pathname);
    const target = document.querySelector("h1");
    if (target)
      addButtonToElement(
        target,
        BTN_LABEL,
        buildWatcherUrl(imdbId, isTV ? "tv" : "movie")
      );
  }

  function addButtonsToMDBListSingleTitle() {
    const imdbId = document
      .querySelector('a[href*="imdb.com/title/"]')
      ?.href?.match(/tt\d+/)?.[0];
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
    const imdbId = document
      .querySelector("a.optionIMDB")
      ?.href?.match(/tt\d+/)?.[0];
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

  function addButtonsToTheTVDBSingleTitle() {
    const imdbId = document
      .querySelector('a[href*="imdb.com/title/"]')
      ?.href?.match(/tt\d+/)?.[0];
    if (!imdbId) return;
    const isTV = /^\/series\//.test(location.pathname);
    const target =
      document.querySelector("h1#series_title") || document.querySelector("h1");
    if (target)
      addButtonToElement(
        target,
        BTN_LABEL,
        buildWatcherUrl(imdbId, isTV ? "tv" : "movie")
      );
  }

  function addButtonsToCritickerSingleTitle() {
    const imdbId = document
      .querySelector('a[href*="imdb.com/title/"]')
      ?.href?.match(/tt\d+/)?.[0];
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

  // Magnet: copy full magnet link, then open Watcher
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

  // ── Main ──────────────────────────────────────────────────

  addMagnetButtons();

  const host = location.hostname;

  if (host === "www.imdb.com" || host === "m.imdb.com") {
    if (/^\/title\//.test(location.pathname)) {
      addButtonsToIMDBSingleTitle();
      changeObserver("body", addButtonsToIMDBSingleTitle);
    }
  } else if (host === "letterboxd.com") {
    if (/^\/film\//.test(location.pathname)) addButtonsToLetterboxdSingleTitle();
  } else if (host === "trakt.tv") {
    if (/^\/(shows|movies)\//.test(location.pathname))
      addButtonsToTraktTVSingleTitle();
  } else if (host === "www.justwatch.com") {
    if (/\/(movie|tv-show)\//.test(location.pathname)) {
      addButtonsToJustWatchSingleTitle();
      changeObserver("#app", addButtonsToJustWatchSingleTitle);
    }
  } else if (host === "mdblist.com") {
    if (/^\/(movie|show)\//.test(location.pathname))
      addButtonsToMDBListSingleTitle();
  } else if (host === "www.icheckmovies.com") {
    if (/^\/movies\//.test(location.pathname)) {
      addButtonsToiCheckMoviesSingleTitle();
    } else if (/^\/lists\//.test(location.pathname)) {
      addButtonsToiCheckMoviesList();
    }
  } else if (host === "thetvdb.com") {
    if (/^\/(movies|series)\//.test(location.pathname)) {
      addButtonsToTheTVDBSingleTitle();
    }
  } else if (host === "www.criticker.com") {
    if (/^\/film\//.test(location.pathname)) {
      addButtonsToCritickerSingleTitle();
    }
  } else if (host === "www.metacritic.com") {
    if (/^\/(movie|tv)\//.test(location.pathname)) {
      addButtonsToMetacriticSingleTitle();
    }
  }
})();
