// --- 0. REGISTRO DEL SERVICE WORKER ---
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
          if (!privacidad) { $errorMsg.innerText = "Debes aceptar la política de privacidad."; }
          else if (!emailRegex.test(email) && email) { $errorMsg.innerText = "Email no válido."; }
          else { $errorMsg.innerText = "Rellena todos los campos."; }
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
        if (response.ok) { window.location.href = "/gracias"; }
        else { throw new Error(); }
      })
      .catch(() => {
        alert("¡Oops! Error al enviar.");
        $button.innerText = "Enviar Mensaje";
        $button.disabled = false;
      });
    });
  }

  // --- 3. LÓGICA DE INSTALACIÓN PWA (Universal) ---
  let deferredPrompt;
  const installSection = document.getElementById('install-app-section');
  const installCard = document.getElementById('install-card');
  const installSVG = installCard?.querySelector('#install-svg');
  const installCTA = installCard?.querySelector('#install-cta');

  // Detectar estado
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

  /**
   * FUNCIÓN PARA OCULTAR SI YA ESTÁ INSTALADO
   */
  if (isStandalone && installSection) {
    installSection.classList.add('hidden');
    return; // Si ya es la app, no ejecutamos el resto de la lógica
  }

  // A. COMPORTAMIENTO PARA IPHONE (Safari no soporta beforeinstallprompt)
  if (isIOS && !isStandalone && installCard) {
    // Mostramos la tarjeta en iPhone
    installCard.classList.remove('hidden');
    
    // Cambiamos el icono al de "Compartir" de Apple
    if (installSVG) {
      installSVG.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a2 2 0 012 2v9a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h2"></path>`;
      installSVG.classList.remove('animate-pulse'); // En iOS es una guía, no un botón de acción inmediata
    }
    
    // Instrucciones específicas para Safari
    if (installCTA) {
      installCTA.innerHTML = `Pulsa <span class="text-primary font-normal"><strong>Compartir (↑)</strong></span><br><span class="text-gray-400 italic">y "Añadir a pantalla de inicio"</span>`;
    }
  }

  // B. COMPORTAMIENTO PARA ANDROID / CHROME / EDGE / WINDOWS
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Mostramos la tarjeta si tenemos el prompt listo y no estamos en modo standalone
    if (installCard && !isStandalone) {
      installCard.classList.remove('hidden');
    }
  });

  // C. ACCIÓN AL PULSAR LA TARJETA
  if (installCard) {
    installCard.addEventListener('click', async () => {
      if (deferredPrompt) {
        // Disparar instalador nativo (Chrome/Android/Windows/Linux)
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          installSection.style.opacity = '0';
          setTimeout(() => installSection.classList.add('hidden'), 500);
        }
        deferredPrompt = null;
      } else if (isIOS) {
        // Recordatorio visual para usuarios de iPhone
        alert("¡Es muy fácil! Pulsa el botón 'Compartir' de tu navegador Safari (el icono del cuadrado con la flecha) y selecciona 'Añadir a pantalla de inicio' para instalar la App de Fotovazquez. ✨");
      }
    });
  }

  // Ocultar definitivamente si se instala con éxito
  window.addEventListener('appinstalled', () => {
    if (installSection) installSection.classList.add('hidden');
    deferredPrompt = null;
  });

});