document.addEventListener('DOMContentLoaded', function() {
  const content = document.querySelector('.content');
  const indexContainer = document.getElementById('heading-index');
  if (!content || !indexContainer) return;

  // Only look for headings in the article body, not listings
  const body = content.querySelector('.body') || content;
  const headings = body.querySelectorAll('h2, h3');
  if (headings.length === 0) {
    indexContainer.style.display = 'none';
    return;
  }

  // Build index
  const inner = document.createElement('div');
  inner.className = 'heading-index-inner';

  headings.forEach((h, i) => {
    if (!h.id) h.id = 'heading-' + i;

    // Add anchor link with SVG icon to heading
    const anchor = document.createElement('a');
    anchor.className = 'heading-anchor';
    anchor.href = '#' + h.id;
    anchor.title = 'Link to this section';
    h.appendChild(anchor);

    // Add to index
    const link = document.createElement('a');
    link.href = '#' + h.id;
    link.textContent = h.textContent;
    if (h.tagName === 'H3') link.classList.add('h3');
    inner.appendChild(link);
  });

  indexContainer.appendChild(inner);

  // Helper to set active link
  function setActive(hash) {
    indexContainer.querySelectorAll('a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === hash);
    });
  }

  // Handle clicks on index links - immediately highlight
  indexContainer.addEventListener('click', function(e) {
    if (e.target.tagName === 'A') {
      setActive(e.target.getAttribute('href'));
    }
  });

  // Track which heading is currently most visible via scroll
  let scrollTimeout;
  const observer = new IntersectionObserver((entries) => {
    // Debounce to avoid fighting with click highlight
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActive('#' + entry.target.id);
        }
      });
    }, 100);
  }, { rootMargin: '-10% 0px -80% 0px' });

  headings.forEach(h => observer.observe(h));
});
