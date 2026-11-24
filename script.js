/* ================== MENÚ RESPONSIVE ================== */
const menuButton = document.querySelector('#menu-btn');
const menu = document.querySelector('#menu-principal');

if (menuButton && menu) {
  menuButton.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    menuButton.innerHTML = isOpen
      ? '<i class="fa-solid fa-xmark" aria-hidden="true"></i>'
      : '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Abrir menú de navegación');
      menuButton.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
    });
  });

  document.addEventListener('click', event => {
    if (!menu.contains(event.target) && !menuButton.contains(event.target)) {
      menu.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Abrir menú de navegación');
      menuButton.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
    }
  });
}

/* ================== ANIMACION PORTADA ================== */
const canvas = document.querySelector('#stars');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (canvas) {
  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let stars = [];
  let animationId = null;

  function initStars() {
    const rect = canvas.getBoundingClientRect();
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const amount = Math.max(45, Math.min(180, Math.floor((width * height) / 6500)));
    stars = Array.from({ length: amount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.25 + 0.25,
      speed: Math.random() * 0.35 + 0.08
    }));

    if (reduceMotion) drawStars();
  }

  function drawStars() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(255,255,255,.9)';
    stars.forEach(star => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function animateStars() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(255,255,255,.9)';
    stars.forEach(star => {
      star.x += star.speed;
      if (star.x > width) star.x = 0;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
    });
    animationId = window.requestAnimationFrame(animateStars);
  }

  initStars();
  if (!reduceMotion) animateStars();

  let resizeTimer;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      if (animationId) window.cancelAnimationFrame(animationId);
      initStars();
      if (!reduceMotion) animateStars();
    }, 120);
  });
}

/* ================== ANIMACIONES AL DESPLAZARSE ================== */
const elementsToReveal = document.querySelectorAll('.reveal, .hidden');

if ('IntersectionObserver' in window && !reduceMotion) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        entry.target.classList.remove('hidden');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elementsToReveal.forEach(element => observer.observe(element));
} else {
  elementsToReveal.forEach(element => {
    element.classList.add('show');
    element.classList.remove('hidden');
  });
}

/* ================== FORMULARIO DE CONTACTO ================== */
const contactForm = document.querySelector('#contactoForm');
const formStatus = document.querySelector('#form-status');

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', async event => {
    event.preventDefault();

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';
    formStatus.textContent = '';
    formStatus.classList.remove('error');

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) throw new Error('No se pudo enviar el mensaje.');

      formStatus.textContent = '¡Mensaje enviado! Gracias por contactarme.';
      contactForm.reset();
    } catch (error) {
      formStatus.textContent = 'No se pudo enviar el mensaje. Intentá nuevamente en unos minutos.';
      formStatus.classList.add('error');
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
    }
  });
}
