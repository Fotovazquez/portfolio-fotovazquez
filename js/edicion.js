(function () {
  const initPage = () => {
    // Reveal para header y sliders
    const revealElements = document.querySelectorAll(".fv-reveal");
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          // Si es un slider, enviamos evento para el "amago" inicial
          if (entry.target.querySelector('.before-image')) {
            entry.target.dispatchEvent(new CustomEvent('start-hint'));
          }
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealElements.forEach((el) => revealObserver.observe(el));

    // Lógica independiente para cada slider
    const containers = document.querySelectorAll(".before-after-container");
    containers.forEach((container) => {
      const beforeImg = container.querySelector(".before-image");
      const handle = container.querySelector(".slider-handle");
      let isDragging = false;

      function update(percent) {
        const p = Math.max(0, Math.min(100, percent));
        window.requestAnimationFrame(() => {
          if (beforeImg) beforeImg.style.clipPath = `inset(0 ${100 - p}% 0 0)`;
          if (handle) handle.style.left = `${p}%`;
        });
      }

      // Amago orgánico cuando entra en pantalla
      container.addEventListener('start-hint', () => {
        setTimeout(() => {
          update(46);
          setTimeout(() => update(50), 350);
        }, 800);
      });

      const onMove = (e) => {
        if (!isDragging) return;
        if (e.cancelable) e.preventDefault();
        const rect = container.getBoundingClientRect();
        const pageX = e.pageX || (e.touches && e.touches[0].pageX);
        const percent = ((pageX - rect.left) / rect.width) * 100;
        update(percent);
      };

      container.addEventListener("mousedown", (e) => { isDragging = true; onMove(e); });
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", () => isDragging = false);

      container.addEventListener("touchstart", (e) => { isDragging = true; onMove(e); }, { passive: false });
      window.addEventListener("touchmove", onMove, { passive: false });
      window.addEventListener("touchend", () => isDragging = false);
    });
  };

  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", initPage) : initPage();
})();

document.querySelectorAll('a[href^="#revelado-"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const id = this.getAttribute('href');
        const target = document.querySelector(id);
        
        if (target) {
            // Calculamos la posición exacta
            const offset = 100; // Ajusta este valor según el alto de tu menú (header)
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = target.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

