/**
 * FOTOVAZQUEZ - selection.js
 * Lógica para la galería de selección (MUESTRARIO) con contador dinámico, marca de agua y filtros
 */

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("seleccion-grid")) {
    ejecutarCargaSeleccion();
  }
});

async function ejecutarCargaSeleccion() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("id");
  const grid = document.getElementById("seleccion-grid");

  if (!token) {
    document.body.innerHTML = `
        <div class="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#131313]">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D0BB95" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <p class="text-slate-300 text-center tracking-widest uppercase text-xs">Enlace no válido.<br/>
            <a href="mailto:contacto@fotovazquez.com" class="hover:text-primary transition-colors"
                  >Contacta con Juan</a> para obtener tu enlace.</p>

<a
              href="https://t.me/fotovazquez"
              target="_blank"
              rel="noopener noreferrer"
              class="relative inline-flex items-center justify-center w-10 h-10 rounded-full text-slate-400 hover:text-primary hover:bg-white/5 transition-all duration-300 group"
              aria-label="Contactar por Telegram">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="transition-all duration-300 group-hover:scale-110">
                <path d="m22 2-7 20-4-9-9-4Z"></path>
                <path d="M22 2 11 13"></path>
              </svg>
              <div
                class="absolute top-full mt-3 left-1/2 -translate-x-1/2 w-32 p-3 bg-bg-dark border border-white/10 rounded-xl shadow-2xl opacity-0 invisible -translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-500 ease-out z-50 pointer-events-none">
                <div
                  class="absolute top-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-bg-dark border-l border-t border-white/10 rotate-45"></div>

                <div
                  class="p-1.5 rounded-lg aspect-square flex items-center justify-center overflow-hidden">
                  <img
                    src="img/qr-telegram-fotovazquez.png"
                    alt="QR Telegram"
                    class="w-full h-full object-contain" />
                </div>

                <p
                  class="text-[10px] text-center text-primary uppercase mt-1 opacity-90 tracking-tight">
                  Avísame en telegram
                </p>
              </div>
            </a>

            <p class="text-slate-300 text-center tracking-widest uppercase text-xs">
            <a
          href="https://www.fotovazquez.com"
          class="inline-block px-8 py-2 border border-primary text-primary text-xs uppercase tracking-[0.2em] hover:bg-primary hover:text-black transition-all duration-500 rounded-full font-bold">
          Volver al inicio
        </a></p>
        </div>`;
    return;
  }

  const CONFIG = {
    carpeta: `img/seleccion/${token}/`,
    prefijo: "foto-",
    extension: ".webp",
    maxPosible: 500,
  };

  const contadorTotalHTML = document.getElementById("total-fotos");
  let i = 1;

  for (i = 1; i <= CONFIG.maxPosible; i++) {
    const rutaFoto = `${CONFIG.carpeta}${CONFIG.prefijo}${i}${CONFIG.extension}`;
    const existe = await comprobarImagen(rutaFoto);
    if (!existe) break;

    const contenedor = document.createElement("div");
    contenedor.className =
      "foto-card group relative w-full max-w-[200px] animate-fade-in self-end flex flex-col items-center";
    contenedor.style.animationDelay = `${i * 0.05}s`;

    contenedor.innerHTML = `
            <div class="absolute -top-3 -left-3 z-30 bg-primary text-black font-bold w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-bg-dark text-xs pointer-events-none">
              ${i}
            </div>

            <div onclick="seleccionarFoto(this, ${i})" 
                 class="foto-seleccionable cursor-pointer relative rounded-lg bg-white/5 border-2 border-transparent shadow-xl overflow-hidden transition-all duration-300 hover:border-primary/40 group inline-block">
              
              <div class="absolute inset-0 z-10 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                <span class="text-[14px] font-bold text-white/[0.09] uppercase tracking-[0.4em] -rotate-45 whitespace-nowrap mix-blend-overlay">
                  FOTOVAZQUEZ FOTOVAZQUEZ FOTOVAZQUEZ
                </span>
              </div>

              <div class="capa-check absolute inset-0 z-20 bg-primary/25 opacity-0 transition-opacity flex items-center justify-center pointer-events-none">
                 <div class="bg-bg-dark/90 text-primary border border-primary/50 rounded-full w-10 h-10 flex items-center justify-center shadow-2xl scale-50 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                 </div>
              </div>

              <img 
                src="${rutaFoto}" 
                alt="Foto de selección ${i}" 
                class="block w-full h-auto max-h-[400px] object-contain pointer-events-none select-none" 
                loading="lazy"
              />
            </div>

            <p class="text-[10px] text-slate-500 mt-4 text-center uppercase tracking-[0.2em] font-medium">
              REF: ${i}
            </p>
        `;

    grid.appendChild(contenedor);
  }

  if (contadorTotalHTML) {
    contadorTotalHTML.innerText = i - 1;
  }

  if (i === 1) {
    document.body.innerHTML = `
        <div class="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#131313]">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D0BB95" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3"/></svg>
            <p class="text-slate-500 text-center tracking-widest uppercase text-xs">Este muestrario aún no tiene fotos.<br/><a href="mailto:contacto@fotovazquez.com" class="hover:text-primary transition-colors">Contacta con Juan</a> o espera un poco más a que suba el contenido.</p>
        </div>`;
  }
}

/**
 * Función que comprueba si una imagen existe
 */
function comprobarImagen(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

/**
 * Función global para copiar los números al portapapeles
 */
window.copiarLista = function () {
  const input = document.getElementById("lista-seleccion");

  if (!input || input.value.trim() === "") {
    mostrarNotificacion("Aún no has seleccionado ninguna foto", "error");
    return;
  }

  navigator.clipboard
    .writeText(input.value)
    .then(() => {
      mostrarNotificacion("¡Lista copiada! Ya puedes enviármela.");
    })
    .catch((err) => {
      input.select();
      document.execCommand("copy");
      mostrarNotificacion("¡Lista copiada! Ya puedes enviármela por correo.");
    });
};

/** Lógica de Selección y Filtros */
let filtradoActivo = false;

window.seleccionarFoto = function (elemento, numero) {
  const input = document.getElementById("lista-seleccion");
  const contadorSeleccionadas = document.getElementById("contador-fotos");
  const capaCheck = elemento.querySelector(".capa-check");
  const iconoCheck = capaCheck.querySelector("div");
  const cardPadre = elemento.closest(".foto-card");

  let numeros = input.value.trim()
    ? input.value.split(",").map((n) => n.trim())
    : [];
  const numStr = numero.toString();
  const indice = numeros.indexOf(numStr);

  if (indice === -1) {
    numeros.push(numStr);
    elemento.classList.replace("border-transparent", "border-primary");
    if (cardPadre) cardPadre.classList.add("es-favorita");
    capaCheck.style.opacity = "1";
    if (iconoCheck) iconoCheck.style.transform = "scale(1)";
  } else {
    numeros.splice(indice, 1);
    elemento.classList.replace("border-primary", "border-transparent");
    if (cardPadre) cardPadre.classList.remove("es-favorita");
    capaCheck.style.opacity = "0";
    if (iconoCheck) iconoCheck.style.transform = "scale(0.5)";
  }

  const listaFinal = numeros.sort((a, b) => parseInt(a) - parseInt(b));
  input.value = listaFinal.join(", ");

  if (contadorSeleccionadas) {
    const total = listaFinal.length;
    contadorSeleccionadas.innerText = `${total} ${total === 1 ? "seleccionada" : "seleccionadas"}`;
  }
};

window.toggleFiltroSeleccionadas = function (boton) {
  const todasLasCards = document.querySelectorAll(".foto-card");
  const favoritas = document.querySelectorAll(".es-favorita");
  const textoBoton = document.getElementById("btn-filtro-texto");
  const iconoContenedor = document.getElementById("btn-filtro-icono");

  const iconoOjoCerrado = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
  const iconoOjoAbierto = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;

  if (!filtradoActivo && favoritas.length === 0) {
    mostrarNotificacion("Aún no has seleccionado ninguna foto", "error");
    return;
  }

  filtradoActivo = !filtradoActivo;

  todasLasCards.forEach((card) => {
    if (filtradoActivo) {
      if (!card.classList.contains("es-favorita")) {
        card.style.display = "none";
      }
      textoBoton.innerText = "Ver todas";
      iconoContenedor.innerHTML = iconoOjoAbierto;
      boton.classList.add("bg-primary", "text-black", "border-primary");
      boton.classList.remove("text-slate-400");
      mostrarNotificacion("Mostrando solo las fotos que has seleccionado");
    } else {
      card.style.display = "flex";
      textoBoton.innerText = "Ver seleccionadas";
      iconoContenedor.innerHTML = iconoOjoCerrado;
      boton.classList.remove("bg-primary", "text-black", "border-primary");
      boton.classList.add("text-slate-400");
    }
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
};

function mostrarNotificacion(mensaje, tipo = "success") {
  const previa = document.getElementById("toast-fotovazquez");
  if (previa) previa.remove();

  const toast = document.createElement("div");
  toast.id = "toast-fotovazquez";
  toast.className = `fixed top-10 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-500 transform translate-y-2 opacity-0 font-bold text-[11px] uppercase tracking-widest text-center min-w-[280px]`;

  if (tipo === "success") {
    toast.classList.add("bg-primary/90", "text-black", "border-primary/20");
  } else {
    toast.classList.add("bg-red-900/90", "text-white", "border-red-500/50");
  }

  toast.innerText = mensaje;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove("opacity-0", "translate-y-2");
  }, 100);

  setTimeout(() => {
    toast.classList.add("opacity-0", "-translate-y-2");
    setTimeout(() => toast.remove(), 500);
  }, 3500);
}

/*

- Lee el parámetro `?id=` de la URL
- Si no hay token muestra pantalla de error con candado
- Si hay token pero la carpeta está vacía muestra mensaje de cámara
- La carpeta de imágenes se construye como `img/seleccion/TOKEN/` donde TOKEN es un alfanumérico cualquiera que le asigno a cada modelo

**Estructura de carpetas que necesito crear:**

img/
  seleccion/
    x7k2p9/
      foto-1.webp
      foto-2.webp
      foto-3.webp
    k3m8q1/
      foto-1.webp
      ...


**URL que le mando al modelo:

https://www.fotovazquez.com/muestrario?id=x7k2p9

*/
