const form = document.querySelector('.feedback-form');
let savedData = {};
const feedback = 'feedback-form-state';

form.addEventListener('submit', event => {
  event.preventDefault();
  if (
    !event.target.elements.email.value ||
    !event.target.elements.message.value
  ) {
    console.error('Please complete all fields before submitting');
    return;
  } else {
    console.log(JSON.parse(localStorage.getItem(feedback)));
    form.reset();
    localStorage.removeItem(feedback);
    savedData = {};
  }
});

form.addEventListener('input', event => {
  localStorage.setItem(
    feedback,
    JSON.stringify({
      email: form.elements.email.value,
      message: form.elements.message.value,
    })
  );
});

window.addEventListener('load', function (event) {
  event.preventDefault();
  savedData = JSON.parse(localStorage.getItem(feedback));
  if (savedData) {
    form.elements.email.value = savedData.email;
    form.elements.message.value = savedData.message;
    console.log('Data loaded from localStorage');
  } else {
    console.log('Nothing saved in localStorage');
  }
});
