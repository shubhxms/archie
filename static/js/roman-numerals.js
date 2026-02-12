(function() {
  function toRoman(num) {
    const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const numerals = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
    let result = '';
    for (let i = 0; i < values.length; i++) {
      while (num >= values[i]) {
        result += numerals[i];
        num -= values[i];
      }
    }
    return result;
  }

  function addRomanNumerals() {
    const content = document.querySelector('.content') || document.querySelector('.main-content') || document.body;
    if (!content) return;

    // Number h2s independently
    const h2s = content.querySelectorAll('h2');
    h2s.forEach((h2, index) => {
      const existingSpan = h2.querySelector('.roman-numeral');
      if (existingSpan) return;

      const prefix = document.createElement('span');
      prefix.className = 'roman-numeral';
      prefix.textContent = toRoman(index + 1) + '. ';
      h2.insertBefore(prefix, h2.firstChild);
    });

    // Number h3s independently
    const h3s = content.querySelectorAll('h3');
    h3s.forEach((h3, index) => {
      const existingSpan = h3.querySelector('.roman-numeral');
      if (existingSpan) return;

      const prefix = document.createElement('span');
      prefix.className = 'roman-numeral';
      prefix.textContent = toRoman(index + 1) + '. ';
      h3.insertBefore(prefix, h3.firstChild);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addRomanNumerals);
  } else {
    addRomanNumerals();
  }
})();
