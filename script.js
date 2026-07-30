const screenText = document.getElementById('screenText');
const screenHint = document.getElementById('screenHint');
const statusTime = document.getElementById('statusTime');
const hiddenInput = document.getElementById('hiddenInput');
const phoneScreen = document.querySelector('.phone-screen');
const btnSend = document.getElementById('btnSend');

let currentText = '';
let startTime = null;
let timerInterval = null;

const updateScreen = () => {
  screenText.textContent = currentText.length > 0 ? currentText : 'Wpisz wiadomość...';
};

const setHint = (text) => {
  screenHint.textContent = text;
};

const updateElapsedTime = () => {
  if (!startTime) {
    statusTime.textContent = '0.0s';
    return;
  }
  const elapsed = (Date.now() - startTime) / 1000;
  statusTime.textContent = `${elapsed.toFixed(1)}s`;
};

const startTimer = () => {
  if (startTime) return;
  startTime = Date.now();
  updateElapsedTime();
  timerInterval = setInterval(updateElapsedTime, 100);
};

const stopTimer = () => {
  if (!startTime) return;
  clearInterval(timerInterval);
  timerInterval = null;
};

hiddenInput.addEventListener('input', (event) => {
  currentText = event.target.value;
  updateScreen();
  if (currentText.length > 0) startTimer();
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
  startTimer();
};

document.addEventListener('keydown', (event) => {
  if (event.target === hiddenInput) return;
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

btnSend.addEventListener('click', () => {
  stopTimer();
  setHint('Wiadomość wysłana');
});

updateScreen();
updateElapsedTime();
hiddenInput.focus();
