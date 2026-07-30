const screenText = document.getElementById('screenText');
const screenHint = document.getElementById('screenHint');
const statusTime = document.getElementById('statusTime');
const hiddenInput = document.getElementById('hiddenInput');
const phoneScreen = document.querySelector('.phone-screen');

let currentText = '';

const updateScreen = () => {
  screenText.textContent = currentText.length > 0 ? currentText : 'Wpisz wiadomość...';
};

const setHint = (text) => {
  screenHint.textContent = text;
};

hiddenInput.addEventListener('input', (event) => {
  currentText = event.target.value;
  updateScreen();
});

hiddenInput.addEventListener('keydown', (event) => {
  if (event.key === 'Backspace') {
    event.preventDefault();
    currentText = currentText.slice(0, -1);
    hiddenInput.value = currentText;
    updateScreen();
    setHint('Usunięto znak');
  }
});

const appendCharacter = (char) => {
  currentText += char;
  hiddenInput.value = currentText;
  updateScreen();
};

document.addEventListener('keydown', (event) => {
  if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
    appendCharacter(event.key);
    setHint('Wpisano znak');
  } else if (event.key === 'Backspace') {
    currentText = currentText.slice(0, -1);
    hiddenInput.value = currentText;
    updateScreen();
    setHint('Usunięto znak');
  }
});

phoneScreen.addEventListener('click', () => {
  hiddenInput.focus();
  setHint('Wpisz wiadomość na klawiaturze');
});

const updateTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  statusTime.textContent = `${hours}:${minutes}`;
};

updateTime();
setInterval(updateTime, 1000);
updateScreen();
hiddenInput.focus();
