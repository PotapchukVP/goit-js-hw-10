import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const notificationButton = document.querySelector('.notification-button');

function notification(type, delay) {
  if (type.toLowerCase() === 'rejected') {
    iziToast.error({
      message: `Rejected promise in ${delay}ms`,
      position: 'topRight',
    });
  } else {
    iziToast.success({
      message: `Fulfilled promise in ${delay}ms`,
      position: 'topRight',
    });
  }
}

notificationButton.addEventListener('click', event => {
  event.preventDefault();
  let radioValue = '';
  let delayValue = 0;
  const radioButton = document.getElementsByName('state');
  radioValue = radioButton[0].checked
    ? radioButton[0].value
    : radioButton[1].value;
  delayValue = parseInt(document.getElementsByName('delay')[0].value, 10);

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (radioValue === 'fulfilled') {
        resolve({ type: radioValue, delay: delayValue });
      } else {
        reject({ type: radioValue, delay: delayValue });
      }
    }, delayValue);
  });

  promise
    .then(value => {
      notification(value.type, value.delay);
    })
    .catch(error => {
      notification(error.type, error.delay);
    });
});
