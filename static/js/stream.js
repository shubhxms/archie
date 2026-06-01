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

  function fmtDate(ts) {
    var d = new Date(ts);
    return (
      MONTHS[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear()
    );
  }

  function monthKey(ts) {
    var d = new Date(ts);
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
  }

  function monthLabel(key) {
    var parts = key.split("-");
    var d = new Date(+parts[0], +parts[1] - 1, 1);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  }

  function buildDrop(item) {
    var drop = document.createElement("div");
    drop.className = "stream-drop";

    var dateEl = document.createElement("span");
    dateEl.className = "stream-date";
    dateEl.textContent = fmtDate(+item.timestamp);
    drop.appendChild(dateEl);

    var body = document.createElement("div");
    body.className = "stream-content";
    body.innerHTML = item.html;
    drop.appendChild(body);

    if (item.media && item.media.length) {
      item.media.forEach(function (m) {
        if (m.type === "photo") {
          var img = document.createElement("img");
          img.src = m.urlToFile;
          img.loading = "lazy";
          img.className = "stream-img";
          drop.appendChild(img);
        }
      });
    }

    return drop;
  }

  function render(items) {
    // Group by month
    var groups = {};
    var order = [];
    items.forEach(function (item) {
      var key = monthKey(+item.timestamp);
      if (!groups[key]) {
        groups[key] = [];
        order.push(key);
      }
      groups[key].push(item);
    });

    order.forEach(function (key) {
      var month = document.createElement("div");
      month.className = "stream-month";

      var heading = document.createElement("h2");
      heading.className = "stream-month-title";
      heading.textContent = monthLabel(key);
      month.appendChild(heading);

      groups[key].forEach(function (item) {
        month.appendChild(buildDrop(item));
      });

      container.appendChild(month);
    });
  }

  fetch(API)
    .then(function (r) {
      return r.ok ? r.json() : Promise.reject(r.status);
    })
    .then(render)
    .catch(function () {
      container.innerHTML =
        '<p class="stream-error">Could not load drops. <a href="https://streams.place/shubhxms">View on streams.place →</a></p>';
    });
})();
