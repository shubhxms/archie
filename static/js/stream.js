(function () {
  var container = document.getElementById("stream-drops");
  if (!container) return;

  var API =
    "https://cors-proxy.shubhxms.workers.dev/?url=" +
    encodeURIComponent("https://streams.place/shubhxms/json");

  var MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  var PAGE_SIZE = 20;
  var allItems = [];
  var cursor = 0;
  var loading = false;

  function fmtDate(ts) {
    var d = new Date(ts);
    return MONTHS[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  }

  function buildDrop(item) {
    var row = document.createElement("div");
    row.className = "stream-drop";

    var dateEl = document.createElement("span");
    dateEl.className = "stream-date";
    dateEl.textContent = fmtDate(+item.timestamp);
    row.appendChild(dateEl);

    var body = document.createElement("div");
    body.className = "stream-content";
    body.innerHTML = item.html;
    row.appendChild(body);

    if (item.media && item.media.length) {
      item.media.forEach(function (m) {
        if (m.type === "photo") {
          var img = document.createElement("img");
          img.src = m.urlToFile;
          img.loading = "lazy";
          img.className = "stream-img";
          row.appendChild(img);
        }
      });
    }

    return row;
  }

  function appendPage() {
    if (loading || cursor >= allItems.length) return;
    loading = true;

    var end = Math.min(cursor + PAGE_SIZE, allItems.length);
    var fragment = document.createDocumentFragment();

    for (var i = cursor; i < end; i++) {
      fragment.appendChild(buildDrop(allItems[i]));
    }

    container.appendChild(fragment);
    cursor = end;
    loading = false;

    updateButton();
  }

  function updateButton() {
    var btn = document.getElementById("stream-more");
    if (!btn) return;

    if (cursor >= allItems.length) {
      btn.textContent = "—" + allItems.length + " drops";
      btn.disabled = true;
      btn.classList.add("stream-more-done");
    } else {
      btn.textContent = "more ↓";
      var remaining = allItems.length - cursor;
      btn.textContent = "more ↓ (" + remaining + ")";
    }
  }

  function onLoad(items) {
    allItems = items;

    var wrapper = document.createElement("div");
    wrapper.className = "stream-count";
    wrapper.textContent = items.length + " drops";
    container.parentNode.insertBefore(wrapper, container);

    appendPage();

    var btn = document.createElement("button");
    btn.id = "stream-more";
    btn.className = "stream-more";
    btn.addEventListener("click", appendPage);
    container.parentNode.insertBefore(btn, container.nextSibling);
    updateButton();
  }

  fetch(API)
    .then(function (r) {
      return r.ok ? r.json() : Promise.reject(r.status);
    })
    .then(onLoad)
    .catch(function () {
      container.innerHTML =
        '<p class="stream-error">Could not load drops. <a href="https://streams.place/shubhxms">View on streams.place →</a></p>';
    });
})();
