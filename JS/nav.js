const currentLocation = window.location.pathname;

const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
  if (link.getAttribute('href') === currentLocation ||
    link.getAttribute('href') === currentLocation.substring(1)) {
    link.classList.add('active');
  }
});

