function getSystemTheme() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getCurrentMode() {
  return localStorage.getItem('theme-storage') || getSystemTheme();
}

function highlightButtons(mode) {
  document.querySelectorAll('.theme-btn').forEach(function(btn) {
    btn.classList.toggle('active', btn.getAttribute('data-theme') === mode);
  });
}

function applyTheme(mode) {
  if (mode === 'dark') {
    document.getElementById('darkModeStyle').disabled = false;
  } else {
    document.getElementById('darkModeStyle').disabled = true;
  }
  document.documentElement.setAttribute('data-theme', mode);
  highlightButtons(mode);
}

function setTheme(mode) {
  localStorage.setItem('theme-storage', mode);
  applyTheme(mode);
}

var currentMode = getCurrentMode();

if (currentMode === 'dark') {
  document.getElementById('darkModeStyle').disabled = false;
} else {
  document.getElementById('darkModeStyle').disabled = true;
}
document.documentElement.setAttribute('data-theme', currentMode);

document.addEventListener('DOMContentLoaded', function() {
  highlightButtons(currentMode);
});
