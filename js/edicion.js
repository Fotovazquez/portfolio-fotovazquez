(function () {
  const initSlider = () => {
    // --- 1. APARICIÓN SUAVE (REVEAL) ---
    const revealElements = document.querySelectorAll(".fv-reveal");

    const observerOptions = {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px",
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");

          const sliderInEntry =
            entry.target.querySelector("#beforeAfterSlider");
          if (sliderInEntry) {
            // Amago orgánico para invitar al usuario a interactuar
            setTimeout(() => {
              updateSliderPosition(46);
              setTimeout(() => updateSliderPosition(50), 350);
            }, 800);
          }
          revealObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach((el) => revealObserver.observe(el));

    // --- 2. LÓGICA DEL SLIDER ---
    const slider = document.getElementById("beforeAfterSlider");
    const beforeImage = document.getElementById("beforeImage");
    const handle = document.getElementById("sliderHandle");

    if (!slider || !beforeImage || !handle) return;

    let isDragging = false;

    // Función de actualización optimizada con requestAnimationFrame
    function updateSliderPosition(percent) {
      const clampedPercent = Math.max(0, Math.min(100, percent));

      window.requestAnimationFrame(() => {
        beforeImage.style.clipPath = `inset(0 ${100 - clampedPercent}% 0 0)`;
        handle.style.left = `${clampedPercent}%`;
      });
    }

    const handleMove = (e) => {
      if (!isDragging) return;

      // Evita el scroll vertical en móviles mientras se desliza el slider
      if (e.cancelable) e.preventDefault();

      const rect = slider.getBoundingClientRect();

      // Obtener posición X (soporta ratón y múltiples dedos en táctil)
      const pageX = e.pageX || (e.touches && e.touches[0].pageX);

      // Cálculo de porcentaje relativo al contenedor
      const x = pageX - rect.left;
      const percent = (x / rect.width) * 100;

      updateSliderPosition(percent);
    };

    const startDragging = (e) => {
      isDragging = true;
      handleMove(e);
      slider.style.cursor = "grabbing";
    };

    const stopDragging = () => {
      isDragging = false;
      slider.style.cursor = "col-resize";
    };

    // --- 3. EVENTOS ---

    // Ratón
    slider.addEventListener("mousedown", startDragging);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", stopDragging);

    // Táctil (Móvil) - passive: false es vital para que preventDefault funcione
    slider.addEventListener("touchstart", startDragging, { passive: false });
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", stopDragging);

    // Seguridad: Bloqueo de arrastre nativo de imágenes del navegador
    slider.querySelectorAll("img").forEach((img) => {
      img.addEventListener("dragstart", (e) => e.preventDefault());
    });
  };

  // Inicialización cuando el DOM esté listo
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSlider);
  } else {
    initSlider();
  }
})();
