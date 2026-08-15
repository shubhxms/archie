document.addEventListener('DOMContentLoaded', function() {
  const content = document.querySelector('.content');
  const indexContainer = document.getElementById('heading-index');
  if (!content || !indexContainer) return;

  const body = content.querySelector('.body') || content;
  const headings = Array.from(body.querySelectorAll('h2, h3'));
  if (document.body.classList.contains('page-home')) {
    headings.push(...document.querySelectorAll('.layout-side-rail h2, .layout-side-rail h3'));
  }
  if (headings.length === 0) {
    indexContainer.style.display = 'none';
    return;
  }

  const usedIds = new Set(Array.from(document.querySelectorAll('[id]'), element => element.id));

  function headingTitle(heading) {
    const copy = heading.cloneNode(true);
    copy.querySelectorAll('.roman-numeral, .heading-anchor').forEach(element => element.remove());
    return copy.textContent.trim();
  }

  function slugifyHeading(heading) {
    const base = headingTitle(heading)
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[’']/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'section';
    let slug = base;
    let suffix = 2;
    while (usedIds.has(slug)) slug = `${base}-${suffix++}`;
    usedIds.add(slug);
    return slug;
  }

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'heading-index-trigger';
  trigger.setAttribute('aria-label', 'Open section navigation');
  trigger.setAttribute('aria-expanded', 'false');
  for (let i = 0; i < 3; i++) {
    const tick = document.createElement('span');
    tick.className = 'heading-index-tick';
    trigger.appendChild(tick);
  }

  const inner = document.createElement('div');
  inner.className = 'heading-index-inner';
  headings.forEach(heading => {
    if (!heading.id) heading.id = slugifyHeading(heading);

    const anchor = document.createElement('a');
    anchor.className = 'heading-anchor';
    anchor.href = '#' + heading.id;
    anchor.title = 'Link to this section';
    heading.appendChild(anchor);

    const link = document.createElement('a');
    link.href = '#' + heading.id;
    link.textContent = heading.textContent;
    if (heading.tagName === 'H3') link.classList.add('h3');
    inner.appendChild(link);
  });

  indexContainer.append(trigger, inner);

  function setActive(hash) {
    inner.querySelectorAll('a').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === hash);
    });
  }

  function openIndex() {
    indexContainer.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
  }

  function closeIndex() {
    indexContainer.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
  }

  trigger.addEventListener('click', function() {
    if (indexContainer.classList.contains('is-open')) closeIndex();
    else openIndex();
  });

  inner.addEventListener('click', function(event) {
    const link = event.target.closest('a');
    if (!link) return;
    setActive(link.getAttribute('href'));
    closeIndex();
  });

  document.addEventListener('click', function(event) {
    if (!indexContainer.contains(event.target)) closeIndex();
  });

  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && indexContainer.classList.contains('is-open')) {
      closeIndex();
      trigger.focus();
    }
  });

  let scrollTimeout;
  const observer = new IntersectionObserver(entries => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive('#' + entry.target.id);
      });
    }, 100);
  }, { rootMargin: '-10% 0px -80% 0px' });

  headings.forEach(heading => observer.observe(heading));
});
