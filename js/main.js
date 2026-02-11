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
              alert(
                data["errors"]
                  .map((error) => error["message"])
                  .join(", "),
              );
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