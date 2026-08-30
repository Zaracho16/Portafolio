
  const canvas = document.getElementById('stars');
  const ctx = canvas.getContext('2d');
  let width, height;
  let stars = [];

  function init() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width;
    canvas.height = height;

    stars = [];
    for(let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.2,
        speed: Math.random() * 0.5 + 0.1
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'white';

    stars.forEach(star => {
      star.x += star.speed;
      if(star.x > width) star.x = 0;

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    init();
  });

  init();
  animate();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        entry.target.classList.remove('hidden');
      }
    });
  }, {
    threshold: 0.2
  });


    // Seccion sobre mi
    document.querySelectorAll('.titulo-sobre-mi, .texto-sobre-mi, .img-sobre-mi').forEach(el => observer.observe(el));

    // Seccion habilidades
    document.querySelectorAll('.cuadro-habilidades, .titulo-habilidades').forEach(el => observer.observe(el));

    // Seccion Proyectos
    document.querySelectorAll('.titulo-proyectos, .contenedor-proyectos').forEach(el => observer.observe(el));

    // Seccion Educacion 
    document.querySelectorAll('.titulo-educacion, .img-educacion, .contenedor-textos-educacion').forEach(el => observer.observe(el));

    // Seccion Contactame
    document.querySelectorAll('.titulo-contactame, .contenedor-general-contactame').forEach(el => observer.observe(el));


  document.querySelector("#contactoForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const data = new FormData(form);

  try {
    const res = await fetch(form.action, {
      method: form.method,
      body: data,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (res.ok) {
      alert("Mensaje enviado con éxito!");
      form.reset();
    } else {
      alert("Ocurrió un error. Por favor, intentá de nuevo.");
    }
  } catch (error) {
    alert("Error de conexión.");
  }
});