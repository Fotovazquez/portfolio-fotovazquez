// --- 0. REGISTRO DEL SERVICE WORKER (Necesario para PWA) ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registrado', reg))
      .catch(err => console.warn('Error al registrar SW', err));
  });
}

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

      const nombre = $form.querySelector('input[name="nombre"]')?.value.trim();
      const email = $form.querySelector('input[name="email"]')?.value.trim();
      const mensaje = $form.querySelector('textarea[name="mensaje"]')?.value.trim();
      const $check = $form.querySelector('input[name="privacidad"]');
      const privacidad = $check ? $check.checked : false;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  // --- 3. LÓGICA DE INSTALACIÓN PWA ---
  let deferredPrompt;
  const installCard = document.getElementById('install-card');

  // Escuchar el evento de instalación (solo Android/PC)
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    // Mostrar la tarjeta si existe en el HTML
    if (installCard) {
      installCard.classList.remove('hidden');
    }
  });

  if (installCard) {
    installCard.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`Usuario respondió: ${outcome}`);
        deferredPrompt = null;
        installCard.classList.add('hidden');
      }
    });
  }

  // Ocultar si la app ya se ha instalado
  window.addEventListener('appinstalled', () => {
    if (installCard) installCard.classList.add('hidden');
    deferredPrompt = null;
  });
});