const screenText = document.getElementById('screenText');
const screenHint = document.getElementById('screenHint');
const statusTime = document.getElementById('statusTime');
const buttons = document.querySelectorAll('.phone-button');
const btnClear = document.getElementById('btnClear');
const btnBack = document.getElementById('btnBack');
const btnSend = document.getElementById('btnSend');

let currentText = '';
let lastKey = null;
let cycleIndex = 0;
let cycleTimer = null;

const keyMap = {
  '1': ['1'],
  '2': ['A', 'B', 'C', '2'],
  '3': ['D', 'E', 'F', '3'],
  '4': ['G', 'H', 'I', '4'],
  '5': ['J', 'K', 'L', '5'],
  '6': ['M', 'N', 'O', '6'],
  '7': ['P', 'Q', 'R', 'S', '7'],
  '8': ['T', 'U', 'V', '8'],
  '9': ['W', 'X', 'Y', 'Z', '9'],
  '*': ['*'],
  '0': [' ', '0'],
  '#': ['#']
};

const updateScreen = () => {
  screenText.textContent = currentText.length > 0 ? currentText : 'Wpisz wiadomość...';
};

const setHint = (text) => {
  screenHint.textContent = text;
};

const resetCycle = () => {
  lastKey = null;
  cycleIndex = 0;
  clearTimeout(cycleTimer);
  cycleTimer = null;
};

const commitCycle = () => {
  resetCycle();
};

const pressKey = (key) => {
  const chars = keyMap[key] || [key];
  if (lastKey === key && chars.length > 1 && currentText.length > 0) {
    cycleIndex = (cycleIndex + 1) % chars.length;
    currentText = currentText.slice(0, -1) + chars[cycleIndex];
    setHint(`Zmieniono znak na ${chars[cycleIndex]}`);
  } else {
    if (lastKey !== null) {
      commitCycle();
    }
    cycleIndex = 0;
    currentText += chars[cycleIndex];
    lastKey = key;
    setHint(`Naciśnięto ${key}`);
  }

  updateScreen();
  clearTimeout(cycleTimer);
  cycleTimer = setTimeout(commitCycle, 1400);
};

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const key = button.dataset.key;
    pressKey(key);
  });
});

btnClear.addEventListener('click', () => {
  currentText = '';
  resetCycle();
  updateScreen();
  setHint('Wiadomość wyczyszczona');
});

btnBack.addEventListener('click', () => {
  if (currentText.length > 0) {
    currentText = currentText.slice(0, -1);
    updateScreen();
    setHint('Usunięto ostatni znak');
  } else {
    setHint('Brak tekstu do usunięcia');
  }
  resetCycle();
});

btnSend.addEventListener('click', () => {
  if (currentText.trim().length === 0) {
    setHint('Wpisz wiadomość najpierw');
    return;
  }
  setHint('Wysłano wiadomość!');
  setTimeout(() => setHint('Naciśnij przycisk 2-9'), 1400);
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
