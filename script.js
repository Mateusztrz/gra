const screenText = document.getElementById('screenText');
const screenHint = document.getElementById('screenHint');
const statusTime = document.getElementById('statusTime');
const hiddenInput = document.getElementById('hiddenInput');
const phoneScreen = document.querySelector('.phone-screen');
const btnSend = document.getElementById('btnSend');

let currentText = '';
let startTime = null;
let timerInterval = null;
let caretIndex = 0;
// multi-tap variables for numeric keypad (Nokia-style)
const multiTapMap = {
  '2': 'abc',
  '3': 'def',
  '4': 'ghi',
  '5': 'jkl',
  '6': 'mno',
  '7': 'pqrs',
  '8': 'tuv',
  '9': 'wxyz',
  '0': ' '
};
let lastMultiKey = null;
let lastMultiTime = 0;
let lastMultiCharIndex = 0;
let lastInsertedWasMulti = false;
let lastInsertedPos = -1;
const multiTapTimeout = 800; // ms

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const updateScreen = () => {
  if (currentText.length === 0) {
    screenText.innerHTML = '<span class="placeholder">Wpisz wiadomość...</span>';
    caretIndex = 0;
    return;
  }

  const left = escapeHtml(currentText.slice(0, caretIndex));
  const right = escapeHtml(currentText.slice(caretIndex));
  screenText.innerHTML = left + '<span class="caret" aria-hidden="true"></span>' + right;
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

const handleKeyInput = (event) => {
  if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
    // handle numeric multi-tap first
    if (multiTapMap.hasOwnProperty(event.key)) {
      event.preventDefault();
      startTimer();
      const now = Date.now();
      const chars = multiTapMap[event.key];

      if (event.key === lastMultiKey && (now - lastMultiTime) < multiTapTimeout && lastInsertedWasMulti && lastInsertedPos === caretIndex - 1) {
        // cycle next character
        lastMultiCharIndex = (lastMultiCharIndex + 1) % chars.length;
        const newChar = chars[lastMultiCharIndex];
        currentText = currentText.slice(0, caretIndex - 1) + newChar + currentText.slice(caretIndex);
      } else {
        // insert first char for this key
        lastMultiCharIndex = 0;
        const newChar = chars[lastMultiCharIndex];
        currentText = currentText.slice(0, caretIndex) + newChar + currentText.slice(caretIndex);
        caretIndex += 1;
        lastInsertedWasMulti = true;
        lastInsertedPos = caretIndex - 1;
      }

      lastMultiKey = event.key;
      lastMultiTime = now;
      hiddenInput.value = currentText;
      updateScreen();
      setHint('Wpisano znak (num)');
      return;
    }

    // regular single-char input (physical keyboard)
    event.preventDefault();
    currentText = currentText.slice(0, caretIndex) + event.key + currentText.slice(caretIndex);
    caretIndex += 1;
    hiddenInput.value = currentText;
    updateScreen();
    startTimer();
    setHint('Wpisano znak');
    // reset multi-tap state
    lastMultiKey = null;
    lastInsertedWasMulti = false;
  } else if (event.key === 'Backspace') {
    event.preventDefault();
    if (caretIndex > 0) {
      currentText = currentText.slice(0, caretIndex - 1) + currentText.slice(caretIndex);
      caretIndex -= 1;
      hiddenInput.value = currentText;
      updateScreen();
      setHint('Usunięto znak');
      // reset multi-tap state if deletion affected last inserted
      lastMultiKey = null;
      lastInsertedWasMulti = false;
    }
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault();
    caretIndex = Math.max(0, caretIndex - 1);
    updateScreen();
  } else if (event.key === 'ArrowRight') {
    event.preventDefault();
    caretIndex = Math.min(currentText.length, caretIndex + 1);
    updateScreen();
  }
};

hiddenInput.addEventListener('input', (event) => {
  if (event.target.value !== currentText) {
    currentText = event.target.value;
    caretIndex = currentText.length;
    updateScreen();
    if (currentText.length > 0) startTimer();
  }
});

window.addEventListener('keydown', (event) => {
  if (document.activeElement !== emailInput) {
    handleKeyInput(event);
  }
});

const focusInput = () => {
  hiddenInput.focus();
  setHint('Wpisz wiadomość na klawiaturze');
};

// click inside display window should set caret position
const displayWindow = document.querySelector('.display-window');

const measureAvgCharWidth = () => {
  const meas = document.createElement('span');
  meas.style.visibility = 'hidden';
  meas.style.position = 'absolute';
  meas.style.whiteSpace = 'pre';
  meas.style.fontFamily = window.getComputedStyle(screenText).fontFamily;
  meas.textContent = 'm';
  document.body.appendChild(meas);
  const w = meas.getBoundingClientRect().width;
  document.body.removeChild(meas);
  return w || 8;
};

displayWindow.addEventListener('click', (e) => {
  const rect = displayWindow.getBoundingClientRect();
  const x = e.clientX - rect.left - 12; // account for padding
  const avg = measureAvgCharWidth();
  let idx = Math.round(Math.max(0, x) / avg);
  idx = Math.min(idx, currentText.length);
  caretIndex = idx;
  focusInput();
  updateScreen();
});

displayWindow.addEventListener('touchstart', (e) => {
  const touch = e.touches[0];
  if (!touch) return;
  const rect = displayWindow.getBoundingClientRect();
  const x = touch.clientX - rect.left - 12;
  const avg = measureAvgCharWidth();
  let idx = Math.round(Math.max(0, x) / avg);
  idx = Math.min(idx, currentText.length);
  caretIndex = idx;
  focusInput();
  updateScreen();
});

const emailModal = document.getElementById('emailModal');
const emailForm = document.getElementById('emailForm');
const emailInput = document.getElementById('emailInput');
const modalCancel = document.getElementById('modalCancel');
const modalStatus = document.getElementById('modalStatus');

const openModal = () => {
  emailModal.classList.add('open');
  emailModal.setAttribute('aria-hidden', 'false');
  emailInput.focus();
};

const closeModal = () => {
  emailModal.classList.remove('open');
  emailModal.setAttribute('aria-hidden', 'true');
  modalStatus.textContent = '';
};

btnSend.addEventListener('click', () => {
  stopTimer();
  setHint('Czas zatrzymany. Wpisz e-mail, aby zapisać.');
  openModal();
});

modalCancel.addEventListener('click', closeModal);

emailForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = emailInput.value.trim();
  if (!email) return;

  modalStatus.textContent = 'Zapisywanie...';

  try {
    const response = await fetch('/save-email', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ email, elapsedTime: statusTime.textContent })
    });

    const contentType = response.headers.get('Content-Type') || '';
    let result = null;

    if (contentType.includes('application/json')) {
      result = await response.json();
    } else {
      const text = await response.text();
      result = { success: false, message: text || `Błąd serwera ${response.status}` };
    }

    if (response.ok && result.success) {
      modalStatus.textContent = 'E-mail zapisany.';
      setHint('E-mail zapisany w bazie.');
      setTimeout(() => {
        closeModal();
      }, 1200);
    } else {
      modalStatus.textContent = result.message || `Błąd zapisu (${response.status})`;
    }
  } catch (error) {
    modalStatus.textContent = 'Błąd połączenia: nie można osiągnąć serwera.';
    console.error('save-email fetch error:', error);
  }
});

updateScreen();
updateElapsedTime();
hiddenInput.focus();
