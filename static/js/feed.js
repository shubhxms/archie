(function () {
  var panel = document.getElementById("feed-panel");
  if (!panel) return;

  function closePanel() {
    panel.hidden = true;
    panel.removeAttribute("style");
    var active = document.querySelector(".feed-card.active");
    if (active) active.classList.remove("active");
  }

  function openPanel(card) {
    var pImg = document.getElementById("feed-panel-img");
    var pTitle = document.getElementById("feed-panel-title");
    var pStars = document.getElementById("feed-panel-stars");
    var pRewatch = document.getElementById("feed-panel-rewatch");
    var pReview = document.getElementById("feed-panel-review");
    var pDate = document.getElementById("feed-panel-date");
    var pLink = document.getElementById("feed-panel-link");

    pImg.src = card.dataset.poster;
    pImg.alt = card.dataset.title;
    pTitle.innerHTML = card.dataset.title + ' <small>(' + card.dataset.year + ')</small>';

    var rating = parseFloat(card.dataset.rating);
    if (rating) {
      var stars = "";
      for (var i = 1; i <= 5; i++) stars += i <= rating ? "★" : "";
      if (rating % 1 > 0) stars += "½";
      stars += ' <span class="feed-detail-rating-num">' + rating.toFixed(1) + "/5</span>";
      pStars.innerHTML = stars;
    } else {
      pStars.innerHTML = '<span class="feed-detail-rating-num">No rating</span>';
    }

    pRewatch.style.display = card.dataset.rewatch === "true" ? "inline-block" : "none";

    var review = card.dataset.review;
    var textarea = document.createElement("textarea");
    textarea.innerHTML = review;
    pReview.textContent = textarea.value;
    pReview.style.display = review ? "block" : "none";

    var d = new Date(card.dataset.watched + "T00:00:00");
    var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    pDate.textContent = "Watched " + months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();

    pLink.href = card.dataset.link;

    panel.hidden = false;
    panel.style.display = "block";
    card.classList.add("active");
  }

  document.addEventListener("click", function (e) {
    var card = e.target.closest(".feed-card");
    if (!card) {
      if (!panel.contains(e.target)) closePanel();
      return;
    }

    var wasActive = card.classList.contains("active");
    if (wasActive) {
      closePanel();
    } else {
      var prev = document.querySelector(".feed-card.active");
      if (prev) prev.classList.remove("active");
      openPanel(card);
    }
  });

  // --- Realtime RSS pull ---

  var RSS_URL = "https://letterboxd.com/sav1tr/rss/";
  var PROXY = "https://api.allorigins.win/raw?url=" + encodeURIComponent(RSS_URL);

  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function decodeEntities(str) {
    var t = document.createElement("textarea");
    t.innerHTML = str;
    return t.value;
  }

  function extractPosterAndReview(desc) {
    var poster = null;
    var imgMatch = desc.match(/<img\s+src="([^"]+)"/);
    if (imgMatch) poster = imgMatch[1];
    var text = desc.replace(/<img[^>]*>/g, "");
    text = text.replace(/<p>Watched on.*?<\/p>/g, "");
    text = text.replace(/<p><em>This review may contain spoilers\.<\/em><\/p>/g, "");
    var pMatches = text.match(/<p>([\s\S]*?)<\/p>/g) || [];
    var parts = [];
    pMatches.forEach(function (p) {
      var c = p.replace(/<\/?p>/g, "")
               .replace(/<br\s*\/?>/g, "\n")
               .replace(/<[^>]+>/g, "");
      c = decodeEntities(c).trim();
      if (c) parts.push(c);
    });
    return { poster: poster, review: parts.join("\n") };
  }

  function parseRSS(xml) {
    var doc = new DOMParser().parseFromString(xml, "text/xml");
    var items = doc.querySelectorAll("item");
    var films = [];
    items.forEach(function (item) {
      function txt(tag, uri) {
        var els = uri
          ? item.getElementsByTagNameNS(uri, tag)
          : item.getElementsByTagName(tag);
        return els.length ? els[0].textContent : "";
      }

      var lb = "https://letterboxd.com";
      var tm = "https://themoviedb.org";

      var desc = txt("description") || "";
      var ext = extractPosterAndReview(desc);

      var rawRating = txt("memberRating", lb);
      var rating = rawRating ? parseFloat(rawRating) : null;
      if (rating !== null && isNaN(rating)) rating = null;

      var rawYear = txt("filmYear", lb);
      var rawTmdb = txt("movieId", tm);

      films.push({
        title: txt("filmTitle", lb),
        year: rawYear ? parseInt(rawYear, 10) : null,
        rating: rating,
        watched: txt("watchedDate", lb),
        rewatch: txt("rewatch", lb) === "Yes",
        liked: txt("memberLike", lb) === "Yes",
        poster: ext.poster,
        review: ext.review,
        link: txt("link"),
        tmdb_id: rawTmdb ? parseInt(rawTmdb, 10) : null,
      });
    });
    films.sort(function (a, b) { return b.watched.localeCompare(a.watched); });
    return films;
  }

  function renderFilms(films) {
    var grouped = {};
    films.forEach(function (f) {
      var m = f.watched.substring(0, 7);
      if (!grouped[m]) grouped[m] = [];
      grouped[m].push(f);
    });
    var sorted = Object.keys(grouped).sort().reverse();

    var monthNames = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December"
    ];

    var html = "";
    sorted.forEach(function (m) {
      var d = new Date(m + "-01T00:00:00");
      html += '<div class="feed-month" data-month="' + m + '">';
      html += '<h2 class="feed-month-title">' + monthNames[d.getMonth()] + " " + d.getFullYear() + "</h2>";
      html += '<div class="feed-grid">';

      grouped[m].forEach(function (f) {
        var ratingAttr = f.rating != null ? f.rating.toFixed(1) : "";
        var starsHtml = "";
        if (f.rating) {
          starsHtml = '<span class="feed-rating">';
          for (var i = 1; i <= 5; i++) {
            if (i <= Math.floor(f.rating)) starsHtml += "●";
            else if (i === Math.ceil(f.rating) && f.rating % 1 > 0) starsHtml += "◐";
          }
          starsHtml += "</span>";
        }

        html += '<div class="feed-card"'
          + ' data-title="' + esc(f.title) + '"'
          + ' data-year="' + (f.year || "") + '"'
          + ' data-rating="' + ratingAttr + '"'
          + ' data-rewatch="' + f.rewatch + '"'
          + ' data-review="' + esc(f.review).replace(/\n/g, "&#10;") + '"'
          + ' data-watched="' + f.watched + '"'
          + ' data-poster="' + esc(f.poster || "") + '"'
          + ' data-link="' + esc(f.link) + '">'
          + '<div class="feed-poster">'
          + '<img src="' + esc(f.poster || "") + '" alt="' + esc(f.title) + '" loading="lazy">'
          + "</div>"
          + '<div class="feed-meta">'
          + '<span class="feed-film-title">' + esc(f.title) + "</span>"
          + '<span class="feed-film-year">' + (f.year || "") + "</span>"
          + starsHtml
          + "</div></div>";
      });

      html += "</div></div>";
    });

    var body = document.querySelector(".feed-body");
    if (!body) return;

    body.querySelectorAll(".feed-month").forEach(function (el) { el.remove(); });

    var panelEl = document.getElementById("feed-panel");
    if (panelEl) {
      panelEl.insertAdjacentHTML("afterend", html);
    } else {
      body.insertAdjacentHTML("beforeend", html);
    }
  }

  fetch(PROXY)
    .then(function (r) { return r.ok ? r.text() : Promise.reject(r.status); })
    .then(parseRSS)
    .then(function (films) { if (films.length) renderFilms(films); })
    .catch(function () {});
})();
