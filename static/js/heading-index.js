document.addEventListener('DOMContentLoaded', function() {
  const content = document.querySelector('.content');
  const indexContainer = document.getElementById('heading-index');
  if (!content || !indexContainer) return;

  // Only look for headings in the article body, not listings
  const body = content.querySelector('.body') || content;
  const headings = Array.from(body.querySelectorAll('h2, h3'));
  if (document.body.classList.contains('page-home')) {
    headings.push(...document.querySelectorAll('.layout-side-rail h2, .layout-side-rail h3'));
  }
  if (headings.length === 0) {
    indexContainer.style.display = 'none';
    return;
  }

  indexContainer.tabIndex = 0;
  indexContainer.setAttribute('role', 'button');
  indexContainer.setAttribute('aria-label', 'Open section navigation');
  indexContainer.setAttribute('aria-expanded', 'false');
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
    link.title = h.textContent;
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

  function openIndex() {
    indexContainer.classList.add('is-open');
    indexContainer.setAttribute('aria-expanded', 'true');
  }

  function closeIndex() {
    indexContainer.classList.remove('is-open');
    indexContainer.setAttribute('aria-expanded', 'false');
  }

  indexContainer.addEventListener('click', function(e) {
    if (!indexContainer.classList.contains('is-open')) {
      e.preventDefault();
      openIndex();
      return;
    }

    const link = e.target.closest('a');
    if (link) {
      setActive(link.getAttribute('href'));
      closeIndex();
    }
  });

  indexContainer.addEventListener('keydown', function(e) {
    if ((e.key === 'Enter' || e.key === ' ') && !indexContainer.classList.contains('is-open')) {
      e.preventDefault();
      openIndex();
    } else if (e.key === 'Escape') {
      closeIndex();
      indexContainer.focus();
    }
  });

  document.addEventListener('click', function(e) {
    if (!indexContainer.contains(e.target)) closeIndex();
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
