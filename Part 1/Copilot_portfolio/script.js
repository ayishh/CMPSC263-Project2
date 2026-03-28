const menuToggle = document.getElementById('menuToggle');
const siteNav = document.getElementById('siteNav');
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');

menuToggle.addEventListener('click', () => {
  siteNav.classList.toggle('open');
});

contactForm.addEventListener('submit', event => {
  event.preventDefault();
  successMessage.style.display = 'block';
  contactForm.reset();
  setTimeout(() => {
    successMessage.style.display = 'none';
  }, 4000);
});
