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

const handleKeyInput = (event) => {
  if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
    event.preventDefault();
    currentText += event.key;
    hiddenInput.value = currentText;
    updateScreen();
    startTimer();
    setHint('Wpisano znak');
  } else if (event.key === 'Backspace') {
    event.preventDefault();
    currentText = currentText.slice(0, -1);
    hiddenInput.value = currentText;
    updateScreen();
    setHint('Usunięto znak');
  }
};

hiddenInput.addEventListener('input', (event) => {
  if (event.target.value !== currentText) {
    currentText = event.target.value;
    updateScreen();
    if (currentText.length > 0) startTimer();
  }
});

window.addEventListener('keydown', (event) => {
  if (document.activeElement !== emailInput) {
    handleKeyInput(event);
  }
});

hiddenInput.addEventListener('keydown', handleKeyInput);

const focusInput = () => {
  hiddenInput.focus();
  setHint('Wpisz wiadomość na klawiaturze');
};

phoneScreen.addEventListener('click', focusInput);
phoneScreen.addEventListener('touchstart', focusInput);

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
    const response = await fetch('save-email.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, elapsedTime: statusTime.textContent })
    });

    const result = await response.json();
    if (response.ok && result.success) {
      modalStatus.textContent = 'E-mail zapisany.';
      setHint('E-mail zapisany w bazie.');
      setTimeout(() => {
        closeModal();
      }, 1200);
    } else {
      modalStatus.textContent = result.message || 'Błąd zapisu.';
    }
  } catch (error) {
    modalStatus.textContent = 'Błąd połączenia.';
  }
});

updateScreen();
updateElapsedTime();
hiddenInput.focus();
