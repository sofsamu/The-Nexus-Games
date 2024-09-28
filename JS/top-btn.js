document.addEventListener('DOMContentLoaded', () => {
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
  
    window.addEventListener('scroll', () => {
      if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        scrollToTopBtn.style.display = 'flex'; // Muestra el botón
      } else {
        scrollToTopBtn.style.display = 'none'; // Oculta el botón
      }
    });
  
    scrollToTopBtn.addEventListener('click', function(event) {
      event.preventDefault(); // Previene el comportamiento por defecto del enlace
  
      window.scrollTo({
        top: 0,
        behavior: 'smooth' // Desplazamiento suave
      });
    });
  });
  
