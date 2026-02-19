document.addEventListener("DOMContentLoaded", () => {
  // --- 1. LÓGICA DE LA GALERÍA (SimpleLightbox) ---
  // Combinamos todos tus selectores posibles para que funcione en todas las páginas
  const selectorGaleria = ".category-card, .gallery a, .galeria-seleccion a";
  const existeGaleria = document.querySelector(selectorGaleria);

  if (existeGaleria && typeof SimpleLightbox !== 'undefined') {
    const gallery = new SimpleLightbox(selectorGaleria, {
      enableKeyboard: true,
      fadeSpeed: 250,
      scrollZoom: false,
      overlayOpacity: 0.9,
      close: true,
      nav: true
    });

    // Control de la leyenda de ayuda (si existe el elemento #sl-ayuda)
    const $ayuda = document.querySelector("#sl-ayuda");
    if ($ayuda) {
      gallery.on("show.simplelightbox", () => {
        $ayuda.style.opacity = "1";
        setTimeout(() => { $ayuda.style.opacity = "0"; }, 3000);
      });
      gallery.on("close.simplelightbox", () => { $ayuda.style.opacity = "0"; });
    }

    // Efecto de desenfoque en el fondo al abrir la foto
    gallery.on("show.simplelightbox", () => document.body.classList.add("sl-open"));
    gallery.on("close.simplelightbox", () => document.body.classList.remove("sl-open"));
  }

  // --- 2. LÓGICA DEL FORMULARIO DE CONTACTO ---
  const $form = document.querySelector("#miFormulario");
  const $button = document.querySelector("#botonEnvio");
  const $errorMsg = document.querySelector("#mensaje-error");

  if ($form && $button) {
    $form.addEventListener("submit", function (event) {
      event.preventDefault();
      if ($errorMsg) $errorMsg.classList.add("hidden");

      const nombre = $form.nombre.value.trim();
      const email = $form.email.value.trim();
      const mensaje = $form.mensaje.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!nombre || !email || !mensaje || !emailRegex.test(email)) {
        if ($errorMsg) {
          $errorMsg.innerText = !emailRegex.test(email) && email 
            ? "Por favor, introduce un email válido." 
            : "Por favor, rellena todos los campos.";
          $errorMsg.classList.remove("hidden");
        }
        return;
      }

      $button.innerText = "Enviando...";
      $button.disabled = true;

      fetch($form.action, {
        method: "POST",
        body: new FormData($form),
        headers: { 'Accept': 'application/json' }
      })
      .then(response => {
        if (response.ok) {
          window.location.href = "/gracias";
        } else {
          alert("¡Oops! Hubo un problema al enviar tu mensaje.");
          $button.innerText = "Enviar Mensaje";
          $button.disabled = false;
        }
      })
      .catch(() => {
        alert("Error de conexión. Inténtalo de nuevo.");
        $button.innerText = "Enviar Mensaje";
        $button.disabled = false;
      });
    });
  }
});


