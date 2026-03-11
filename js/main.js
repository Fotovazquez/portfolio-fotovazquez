// --- 0. REGISTRO DEL SERVICE WORKER ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registrado', reg))
      .catch(err => console.warn('Error al registrar SW', err));
  });
}

// --- FUNCIÓN DE NOTIFICACIÓN (Añadida para el formulario) ---
window.mostrarNotificacion = function(mensaje, tipo = "success") {
    const previa = document.getElementById('toast-fotovazquez');
    if (previa) previa.remove();

    const toast = document.createElement('div');
    toast.id = 'toast-fotovazquez';
    
    // CAMBIO CLAVE: top-1/2 y -translate-y-1/2 para centrado total
    toast.className = `fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] px-8 py-6 rounded-2xl border backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-500 transform font-bold text-[13px] uppercase tracking-widest text-center min-w-[300px] opacity-0 scale-90`;
    
    if (tipo === "success") {
        toast.classList.add('bg-primary/95', 'text-black', 'border-white/20');
    } else {
        toast.classList.add('bg-red-900/95', 'text-white', 'border-red-500/50');
    }

    toast.innerText = mensaje;
    document.body.appendChild(toast);

    // Animación: aparece desde el centro escalando un poco (efecto pop-up)
    setTimeout(() => { 
        toast.classList.remove('opacity-0', 'scale-90');
        toast.classList.add('opacity-100', 'scale-100');
    }, 10);

    // Auto-eliminar
    setTimeout(() => {
        toast.classList.remove('scale-100');
        toast.classList.add('opacity-0', 'scale-95');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
};

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

  // --- 2. LÓGICA DEL FORMULARIO DE CONTACTO (ACTUALIZADA) ---    
  const $form = document.querySelector("#miFormulario");
  const $button = document.querySelector("#botonEnvio");

  if ($form && $button) {
    $form.addEventListener("submit", function (event) {
      event.preventDefault();

      const nombre = $form.querySelector('input[name="nombre"]')?.value.trim();
      const email = $form.querySelector('input[name="email"]')?.value.trim();
      const mensaje = $form.querySelector('textarea[name="mensaje"]')?.value.trim();
      const $check = $form.querySelector('input[name="privacidad"]');
      const privacidad = $check ? $check.checked : false;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Validaciones con notificaciones
      if (!nombre) return window.mostrarNotificacion("Por favor, escribe tu nombre.", "error");
      if (!email || !emailRegex.test(email)) return window.mostrarNotificacion("El Email no es válido.", "error");
      if (!mensaje) return window.mostrarNotificacion("Por favor, escribe tu propuesta.", "error");
      if (!privacidad) return window.mostrarNotificacion("Debes aceptar la política privacidad.", "error");

      $button.innerText = "Enviando...";
      $button.disabled = true;

      fetch($form.action, {
        method: "POST",
        body: new FormData($form),
        headers: { 'Accept': 'application/json' }
      })
      .then(response => {
        if (response.ok) { 
            window.mostrarNotificacion("Enviando mensaje...");
            setTimeout(() => { window.location.href = "/gracias"; }, 1500); 
        }
        else { throw new Error(); }
      })
      .catch(() => {
        window.mostrarNotificacion("Ha ocurrido un error al enviar tu mensaje.", "error");
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

  if (installSection) installSection.classList.add('hidden');

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

  async function checkInstallation() {
    if (isStandalone) {
      if (installSection) installSection.remove();
      return;
    }
    if ('getInstalledRelatedApps' in navigator) {
      try {
        const relatedApps = await navigator.getInstalledRelatedApps();
        if (relatedApps && relatedApps.length > 0) {
          if (installSection) installSection.remove();
          return;
        }
      } catch (err) { console.log("SW detect fail"); }
    }
    if (isIOS) { showIOSInstructions(); }
  }

  function showIOSInstructions() {
    if (installSection) installSection.classList.remove('hidden');
    if (installSVG) {
      installSVG.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a2 2 0 012 2v9a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h2"></path>`;
      installSVG.classList.remove('animate-pulse');
    }
    if (installCTA) {
      installCTA.innerHTML = `Pulsa <span class="text-primary font-normal"><strong>Compartir (↑)</strong></span><br><span class="text-gray-400 italic">y "Añadir a pantalla de inicio"</span>`;
    }
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installSection) installSection.classList.remove('hidden');
  });

  if (installCard) {
    installCard.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') hideSmoothly();
        deferredPrompt = null;
      } else if (isIOS) {
        window.mostrarNotificacion("Usa el menú compartir de Safari ✨");
      }
    });
  }

  window.addEventListener('appinstalled', () => {
    hideSmoothly();
    deferredPrompt = null;
  });

  function hideSmoothly() {
    if (installSection) {
      installSection.style.transition = 'opacity 0.4s ease';
      installSection.style.opacity = '0';
      setTimeout(() => installSection.remove(), 450);
    }
  }

  checkInstallation();
});