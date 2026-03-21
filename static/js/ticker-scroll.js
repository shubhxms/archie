const ticker = document.querySelector('.ticker');

if (ticker) {
  // Hide ticker on mobile screens
  const checkMobile = () => {
    if (window.innerWidth <= 800) {
      ticker.style.display = 'none';
    } else {
      ticker.style.display = '';
    }
  };

  checkMobile();
  window.addEventListener('resize', checkMobile);

  // Hide/show on scroll (only on desktop)
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    if (window.innerWidth <= 800) return;

    const currentScroll = window.scrollY;

    if (currentScroll > lastScroll && currentScroll > 50) {
      ticker.classList.add('hidden');
    } else {
      ticker.classList.remove('hidden');
    }
    lastScroll = currentScroll;
  });
}
