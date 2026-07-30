const input = document.getElementById('messageInput');
const screenText = document.getElementById('screenText');

input.addEventListener('input', (event) => {
  const value = event.target.value.trim();
  screenText.textContent = value.length > 0 ? value : 'Wpisz coś poniżej...';
});
