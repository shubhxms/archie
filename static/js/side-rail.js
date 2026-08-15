(() => {
	var rail = document.querySelector(".layout-side-rail");
	if (!rail) return;

	function layoutRail() {
		var items = rail.querySelectorAll("[data-rail-anchor]");
			var desktop = window.innerWidth >= 1280;
		var railTop = rail.getBoundingClientRect().top;
		var nextTop = 0;

		items.forEach((item) => {
			if (!desktop) {
				item.style.removeProperty("position");
				item.style.removeProperty("top");
				return;
			}

			var anchor = document.querySelector("#" + item.dataset.railAnchor);
			if (!anchor) return;
			var anchorTop = anchor.getBoundingClientRect().top - railTop;
			var top = Math.max(anchorTop, nextTop);
			item.style.position = "absolute";
			item.style.top = Math.round(top) + "px";
			nextTop = top + item.offsetHeight + 16;
		});
	}

	var resizeTimer;
	window.addEventListener("resize", () => {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(layoutRail, 100);
	});
	window.addEventListener("load", layoutRail);
	if (document.fonts && document.fonts.ready)
		document.fonts.ready.then(layoutRail);
	layoutRail();
})();
