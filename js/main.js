document.addEventListener("DOMContentLoaded", () => {
  const $form = document.querySelector("#miFormulario");
  const $button = document.querySelector("#botonEnvio");
  const $errorMsg = document.querySelector("#mensaje-error");

  if (!$form) return; // Seguridad por si el formulario no está en la página

  $form.addEventListener("submit", function (event) {
    event.preventDefault();

    $errorMsg.classList.add("hidden");
    const nombre = $form.nombre.value.trim();
    const email = $form.email.value.trim();
    const mensaje = $form.mensaje.value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nombre || !email || !mensaje || !emailRegex.test(email)) {
      $errorMsg.innerText =
        !emailRegex.test(email) && email
          ? "Por favor, introduce un email válido."
          : "Por favor, rellena todos los campos para poder contactar.";
      $errorMsg.classList.remove("hidden");
      return;
    }

    $button.innerText = "Enviando...";
    $button.disabled = true;

    const data = new FormData($form);

    fetch($form.action, {
      method: "POST",
      body: data,
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          window.location.href = "/gracias";
        } else {
          response.json().then((data) => {
            if (Object.hasOwn(data, "errors")) {
              alert(data["errors"].map((error) => error["message"]).join(", "));
            } else {
              alert("¡Oops! Parece que hubo un problema al enviar tu mensaje.");
            }
          });
          $button.innerText = "Enviar Mensaje";
          $button.disabled = false;
        }
      })
      .catch((error) => {
        alert("Error de conexión. Inténtalo de nuevo o un poco más tarde.");
        $button.innerText = "Enviar Mensaje";
        $button.disabled = false;
      });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. LÓGICA DE LA GALERÍA (SimpleLightbox) ---

  // Inicializamos la galería apuntando a los enlaces de tus fotos
  // He usado '.category-card' que es la clase que tienes en tu HTML
  const gallery = new SimpleLightbox(".category-card", {
    enableKeyboard: true,
    fadeSpeed: 200,
    scrollZoom: false,
  });

  const $ayuda = document.querySelector("#sl-ayuda");

  if ($ayuda) {
    // Al abrir la galería
    gallery.on("show.simplelightbox", () => {
      $ayuda.style.opacity = "1"; // Mostramos la leyenda

      // La ocultamos automáticamente a los 3 segundos
      setTimeout(() => {
        $ayuda.style.opacity = "0";
      }, 3000);
    });

    // Si cierran la galería manualmente, nos aseguramos de ocultarla
    gallery.on("close.simplelightbox", () => {
      $ayuda.style.opacity = "0";
    });
  }

  // --- 2. LÓGICA DEL FORMULARIO ---
  const $form = document.querySelector("#miFormulario");
  const $button = document.querySelector("#botonEnvio");
  const $errorMsg = document.querySelector("#mensaje-error");

  if (!$form) return;

  $form.addEventListener("submit", function (event) {
    event.preventDefault();

    $errorMsg.classList.add("hidden");
    const nombre = $form.nombre.value.trim();
    const email = $form.email.value.trim();
    const mensaje = $form.mensaje.value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nombre || !email || !mensaje || !emailRegex.test(email)) {
      $errorMsg.innerText =
        !emailRegex.test(email) && email
          ? "Por favor, introduce un email válido."
          : "Por favor, rellena todos los campos para poder contactar.";

      $errorMsg.classList.remove("hidden");

      return;
    }

    $button.innerText = "Enviando...";
    $button.disabled = true;

    const data = new FormData($form);

    fetch($form.action, {
      method: "POST",
      body: data,
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          window.location.href = "/gracias";
        } else {
          response.json().then((data) => {
            if (Object.hasOwn(data, "errors")) {
              alert(data["errors"].map((error) => error["message"]).join(", "));
            } else {
              alert("¡Oops! Parece que hubo un problema al enviar tu mensaje.");
            }
          });
          $button.innerText = "Enviar Mensaje";
          $button.disabled = false;
        }
      })
      .catch((error) => {
        alert("Error de conexión. Inténtalo de nuevo o un poco más tarde.");
        $button.innerText = "Enviar Mensaje";
        $button.disabled = false;
      });
  });
});

//CONTROL GALERÍA
document.addEventListener("DOMContentLoaded", function () {
  // Inicializamos la galería
  var lightbox = new SimpleLightbox(".gallery a", {
    overlayOpacity: 0.9,
    disableScroll: true,
    fadeSpeed: 250,
    close: true,
    scrollZoom: false,
    nav: true,
  });

  // Eventos para el efecto de desenfoque
  lightbox.on("show.simplelightbox", function () {
    document.body.classList.add("sl-open");
  });

  lightbox.on("close.simplelightbox", function () {
    document.body.classList.remove("sl-open");
  });
});
