/**
 * FOTOVAZQUEZ - seleccion.js
 * Lógica para la galería de selección con contador dinámico y marca de agua
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
    const contadorHTML = document.getElementById('total-fotos');
    let i = 1;

    // Iniciamos la carga iterativa
    for (i = 1; i <= CONFIG.maxPosible; i++) {
        const rutaFoto = `${CONFIG.carpeta}${CONFIG.prefijo}${i}${CONFIG.extension}`;
        
        // Verificamos si la imagen existe en el servidor
        const existe = await comprobarImagen(rutaFoto);
        
        // Si no existe, rompemos el bucle (hemos llegado al final de las fotos)
        if (!existe) break;

        const contenedor = document.createElement('div');
        // "self-end" para alinear fotos de distinta altura por su base
        contenedor.className = "group relative w-full max-w-[200px] animate-fade-in self-end";
        contenedor.style.animationDelay = `${i * 0.05}s`;
        
        contenedor.innerHTML = `
            <div class="absolute -top-3 -left-3 z-20 bg-primary text-black font-bold w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-bg-dark text-xs">
              ${i}
            </div>

            <div class="relative rounded-lg bg-white/5 border border-white/10 shadow-xl overflow-hidden flex items-center justify-center group-hover:border-primary/40 transition-all duration-300">
              
              <div class="absolute inset-0 z-10 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                <span class="text-[14px] font-bold text-white/[0.09] uppercase tracking-[0.4em] -rotate-45 whitespace-nowrap mix-blend-overlay">
                  FOTOVAZQUEZ FOTOVAZQUEZ FOTOVAZQUEZ
                </span>
              </div>

              <img 
                src="${rutaFoto}" 
                alt="Foto de selección ${i}" 
                class="w-full h-auto max-h-[300px] object-contain pointer-events-none select-none" 
                loading="lazy"
              />
            </div>

            <p class="text-[10px] text-slate-500 mt-4 text-center uppercase tracking-[0.2em] font-medium">
              REF: ${i.toString().padStart(3, '0')}
            </p>
        `;
        
        grid.appendChild(contenedor);
    }

    // Actualizamos el contador en el HTML
    if (contadorHTML) {
        // Restamos 1 porque el bucle se detiene cuando 'i' apunta a una foto que NO existe
        contadorHTML.innerText = i - 1;
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
    
    if (!input || input.value.trim() === "") {
        alert("Por favor, escribe primero los números de las fotos que has elegido.");
        return;
    }

    input.select();
    input.setSelectionRange(0, 99999); // Para móviles

    try {
        document.execCommand("copy");
        alert("¡Lista copiada correctamente! Ya puedes enviármela.");
    } catch (err) {
        alert("Error al copiar. Por favor, selecciona el texto manualmente.");
    }
};