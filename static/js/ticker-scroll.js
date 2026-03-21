const ticker = document.querySelector('.ticker');

if (ticker) {
  // Hide/show on scroll
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > lastScroll && currentScroll > 50) {
      ticker.classList.add('hidden');
    } else {
      ticker.classList.remove('hidden');
    }
    lastScroll = currentScroll;
  });
}
