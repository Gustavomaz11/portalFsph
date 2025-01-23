const toggle = document.getElementById('sizeToggle');
const sizes = ['small', 'medium', 'large'];
let currentSize = 0;

toggle.addEventListener('click', () => {
  currentSize = (currentSize + 1) % 3;
  toggle.textContent = `Aa (${currentSize + 1}/3)`;
});
