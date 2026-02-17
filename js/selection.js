/**
 * FOTOVAZQUEZ - seleccion.js
 * Lógica para la galería de selección con contador dinámico, marca de agua y filtros
 */

document.addEventListener("DOMContentLoaded", () => {
    // Solo se ejecuta si existe el grid de selección en la página
    if (document.getElementById('seleccion-grid')) {
        ejecutarCargaSeleccion();
    }
});

async function ejecutarCargaSeleccion() {
    const CONFIG = {
        carpeta: 'img/seleccion/',
        prefijo: 'foto-',
        extension: '.webp',
        maxPosible: 500
    };

    const grid = document.getElementById('seleccion-grid');
    const contadorTotalHTML = document.getElementById('total-fotos'); // El total de la galería
    let i = 1;

    // Iniciamos la carga iterativa
    for (i = 1; i <= CONFIG.maxPosible; i++) {
        const rutaFoto = `${CONFIG.carpeta}${CONFIG.prefijo}${i}${CONFIG.extension}`;
        
        // Verificamos si la imagen existe en el servidor
        const existe = await comprobarImagen(rutaFoto);
        
        // Si no existe, rompemos el bucle
        if (!existe) break;

        const contenedor = document.createElement('div');
        // Clase 'foto-card' añadida para control de filtros
        contenedor.className = "foto-card group relative w-full max-w-[200px] animate-fade-in self-end flex flex-col items-center";
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

    // Actualizamos el contador total de la galería
    if (contadorTotalHTML) {
        contadorTotalHTML.innerText = i - 1;
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
window.copiarLista = function() {
    const input = document.getElementById('lista-seleccion');
    const btn = event.currentTarget; // Capturamos el botón para el feedback
    
    if (!input || input.value.trim() === "") {
        alert("Aún no has seleccionado ninguna foto del muestrario.");
        return;
    }

    input.select();
    input.setSelectionRange(0, 99999); // Para móviles

    try {
        navigator.clipboard.writeText(input.value).then(() => {
            const textoOriginal = btn.innerText;
            btn.innerText = "¡COPIADO!";
            btn.classList.add('bg-green-600');
            
            setTimeout(() => {
                btn.innerText = textoOriginal;
                btn.classList.remove('bg-green-600');
            }, 2000);
        });
    } catch (err) {
        // Fallback para navegadores antiguos
        document.execCommand("copy");
        alert("Lista copiada.");
    }
};

/** Lógica de Selección y Filtros */
let filtradoActivo = false;

window.seleccionarFoto = function(elemento, numero) {
    const input = document.getElementById('lista-seleccion');
    const contadorSeleccionadas = document.getElementById('contador-fotos');
    const capaCheck = elemento.querySelector('.capa-check');
    const iconoCheck = capaCheck.querySelector('div');
    const cardPadre = elemento.closest('.foto-card'); // Buscamos el contenedor principal
    
    let numeros = input.value.trim() ? input.value.split(',').map(n => n.trim()) : [];
    const numStr = numero.toString();
    const indice = numeros.indexOf(numStr);

    if (indice === -1) {
        // SELECCIONAR
        numeros.push(numStr);
        elemento.classList.replace('border-transparent', 'border-primary');
        if(cardPadre) cardPadre.classList.add('es-favorita');
        capaCheck.style.opacity = "1";
        if(iconoCheck) iconoCheck.style.transform = "scale(1)";
    } else {
        // DESELECCIONAR
        numeros.splice(indice, 1);
        elemento.classList.replace('border-primary', 'border-transparent');
        if(cardPadre) cardPadre.classList.remove('es-favorita');
        capaCheck.style.opacity = "0";
        if(iconoCheck) iconoCheck.style.transform = "scale(0.5)";
    }

    // Actualizar Input y Ordenar numéricamente
    const listaFinal = numeros.sort((a, b) => parseInt(a) - parseInt(b));
    input.value = listaFinal.join(', ');

    // Actualizar contador dinámico de "X seleccionadas"
    if (contadorSeleccionadas) {
        const total = listaFinal.length;
        contadorSeleccionadas.innerText = `${total} ${total === 1 ? 'seleccionada' : 'seleccionadas'}`;
    }
};

// Función para alternar entre ver todas o solo favoritas
window.toggleFiltroSeleccionadas = function(boton) {
    const todasLasCards = document.querySelectorAll('.foto-card');
    filtradoActivo = !filtradoActivo;

    todasLasCards.forEach(card => {
        if (filtradoActivo) {
            // Ocultamos las que no son favoritas
            if (!card.classList.contains('es-favorita')) {
                card.style.display = 'none';
            }
            boton.innerText = "Ver todas";
            boton.classList.add('bg-primary', 'text-black');
        } else {
            // Mostramos todo
            card.style.display = 'flex';
            boton.innerText = "Ver favoritas";
            boton.classList.remove('bg-primary', 'text-black');
        }
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Función para alternar entre ver todas o solo favoritas con aviso de lista vacía
window.toggleFiltroSeleccionadas = function(boton) {
    const todasLasCards = document.querySelectorAll('.foto-card');
    const favoritas = document.querySelectorAll('.es-favorita');
    const textoBoton = document.getElementById('btn-filtro-texto');
    const iconoContenedor = document.getElementById('btn-filtro-icono');
    
    // SVGs ligeramente más pequeños (14px)
    const iconoOjoCerrado = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
    const iconoOjoAbierto = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;

    if (!filtradoActivo && favoritas.length === 0) {
        alert("Aún no has seleccionado ninguna foto como favorita.");
        return;
    }

    filtradoActivo = !filtradoActivo;

    todasLasCards.forEach(card => {
        if (filtradoActivo) {
            if (!card.classList.contains('es-favorita')) {
                card.style.display = 'none';
            }
            textoBoton.innerText = "Ver todas";
            iconoContenedor.innerHTML = iconoOjoAbierto;
            boton.classList.add('bg-primary', 'text-black', 'border-primary');
            boton.classList.remove('text-slate-400');
        } else {
            card.style.display = 'flex';
            textoBoton.innerText = "Ver seleccionadas";
            iconoContenedor.innerHTML = iconoOjoCerrado;
            boton.classList.remove('bg-primary', 'text-black', 'border-primary');
            boton.classList.add('text-slate-400');
        }
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
};