import 'flatpickr/dist/flatpickr.min.css';
import flatpickr from 'flatpickr';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const calendars = document.querySelector('#datetime-picker');
const startButton = document.querySelector('button[data-start]');
const daysValue = document.querySelector('[data-days]');
const hoursValue = document.querySelector('[data-hours]');
const minutesValue = document.querySelector('[data-minutes]');
const secondsValue = document.querySelector('[data-seconds]');

let userSelectedDate = {};
let countdownInterval;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = new Date(selectedDates[0]).getTime();
    changeButtonState();
  },
  onChange(selectedDates) {
    userSelectedDate = new Date(selectedDates[0]).getTime();
    changeButtonState();
  },
};

disableStartButton();
flatpickr(calendars, options);

startButton.addEventListener('click', () => {
  const selectedDate = new Date(calendars._flatpickr.selectedDates[0]);
  disableStartButton();
  startCountdown(selectedDate);
});

function changeButtonState() {
  const currentDate = Date.now();
  const timeDifference = userSelectedDate - currentDate;
  if (timeDifference > 0) enableStartButton();
  else {
    iziToast.error({
      title: 'Error',
      message: 'Please choose a date in the future',
      position: 'topRight',
    });
    disableStartButton();
  }
}

function disableStartButton() {
  startButton.disabled = true;
  startButton.style.opacity = 0.4;
  startButton.style.pointerEvents = 'none';
}

function enableStartButton() {
  startButton.disabled = false;
  startButton.style.opacity = 1;
  startButton.style.cursor = 'pointer';
  startButton.style.pointerEvents = 'auto';
}

function addLeadingZero(value) {
  return value < 10 ? `0${value}` : value;
}

function startCountdown(targetDate) {
  clearInterval(countdownInterval);

  if (isNaN(targetDate)) {
    console.error('Invalid date.');
    return;
  }

  countdownInterval = setInterval(() => {
    const now = new Date();
    const difference = targetDate - now;

    if (difference <= 0) {
      clearInterval(countdownInterval);
      updateTimerDisplay(convertMs(0));
      iziToast.success({
        title: 'Success',
        message: 'Countdown finished!',
        position: 'topRight',
      });
      enableStartButton();
    } else {
      updateTimerDisplay(convertMs(difference));
    }
  }, 1000);
}

function updateTimerDisplay(time) {
  daysValue.textContent = addLeadingZero(time.days);
  hoursValue.textContent = addLeadingZero(time.hours);
  minutesValue.textContent = addLeadingZero(time.minutes);
  secondsValue.textContent = addLeadingZero(time.seconds);
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
