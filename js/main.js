document.addEventListener("DOMContentLoaded", () => {
  // --- 1. LÓGICA DE LA GALERÍA (SimpleLightbox) ---
  const selectorGaleria = ".category-card, .gallery a, .galeria-seleccion a";
  const existeGaleria = document.querySelector(selectorGaleria);

  if (existeGaleria && typeof SimpleLightbox !== "undefined") {
    const gallery = new SimpleLightbox(selectorGaleria, {
      enableKeyboard: true,
      fadeSpeed: 250,
      scrollZoom: false,
      overlayOpacity: 0.9,
      close: true,
      nav: true,
    });

    const $ayuda = document.querySelector("#sl-ayuda");
    if ($ayuda) {
      gallery.on("show.simplelightbox", () => {
        $ayuda.style.opacity = "1";
        setTimeout(() => { $ayuda.style.opacity = "0"; }, 3000);
      });
      gallery.on("close.simplelightbox", () => { $ayuda.style.opacity = "0"; });
    }

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

      // Selectores seguros
      const nombre = $form.querySelector('input[name="nombre"]')?.value.trim();
      const email = $form.querySelector('input[name="email"]')?.value.trim();
      const mensaje = $form.querySelector('textarea[name="mensaje"]')?.value.trim();
      const $check = $form.querySelector('input[name="privacidad"]');
      const privacidad = $check ? $check.checked : false;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // VALIDACIÓN
      if (!nombre || !email || !mensaje || !emailRegex.test(email) || !privacidad) {
        if ($errorMsg) {
          if (!privacidad) {
            $errorMsg.innerText = "Debes aceptar la política de privacidad para continuar.";
          } else if (!emailRegex.test(email) && email) {
            $errorMsg.innerText = "Por favor, introduce un email válido.";
          } else {
            $errorMsg.innerText = "Por favor, rellena todos los campos.";
          }
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
          throw new Error();
        }
      })
      .catch(() => {
        alert("¡Oops! Hubo un problema al enviar tu mensaje.");
        $button.innerText = "Enviar Mensaje";
        $button.disabled = false;
      });
    });
  }
}); 

//PWA
let deferredPrompt;
  const installCard = document.getElementById('install-card');

  window.addEventListener('beforeinstallprompt', (e) => {
    // Evita que el navegador muestre su propio aviso automático
    e.preventDefault();
    // Guarda el evento para dispararlo cuando queramos
    deferredPrompt = e;
    // Muestra la tarjeta (por defecto está oculta con 'hidden')
    installCard.classList.remove('hidden');
  });

  installCard.addEventListener('click', async () => {
    if (deferredPrompt) {
      // Muestra el cuadro de diálogo de instalación
      deferredPrompt.prompt();
      // Espera a ver qué responde el usuario
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`Usuario respondió: ${outcome}`);
      // Limpiamos la variable, ya no se puede usar más
      deferredPrompt = null;
      // Ocultamos la tarjeta tras la instalación
      installCard.classList.add('hidden');
    }
  });

  // Ocultar si ya está instalada la App
  window.addEventListener('appinstalled', () => {
    installCard.classList.add('hidden');
    deferredPrompt = null;
  });