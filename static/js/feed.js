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
})();
