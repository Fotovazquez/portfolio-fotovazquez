document.addEventListener("DOMContentLoaded", function() {
    const banner = document.getElementById('banner-flotante');
    const card = document.getElementById('banner-card');
    const btnCerrar = document.getElementById('banner-cerrar');
    const btnPicar = document.getElementById('promociones');
    const bg = document.getElementById('banner-bg');
    const loader = document.getElementById('cine-loader');

    function lanzarBanner() {
        // COMPROBACIÓN: Si ya se ha visto en esta sesión, no hacer nada
        if (sessionStorage.getItem('fvBannerVisto')) {
            return;
        }

        // Bloqueamos el scroll del body
        document.body.style.overflow = 'hidden';
        
        // Desenfoque manual del contenido
        const main = document.querySelector('main');
        if (main) main.style.filter = 'blur(4px)';

        // Mostramos el contenedor
        banner.style.display = 'flex';
        
        // Animamos la tarjeta
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        }, 100);

        // MARCAMOS COMO VISTO: Para que no vuelva a salir en esta sesión
        sessionStorage.setItem('fvBannerVisto', 'true');
    }

    function cerrarTodo() {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8)';
        const main = document.querySelector('main');
        if (main) main.style.filter = 'none';
        
        setTimeout(() => {
            banner.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 500);
    }

    // Lógica de disparo vinculada al loader
    let checkLoader = setInterval(() => {
        // Si el loader no existe, o ya se ha ocultado (display none o clase fade-out)
        if (!loader || loader.style.display === 'none' || loader.classList.contains('fade-out')) {
            clearInterval(checkLoader);
            
            // Solo intentamos lanzarlo si no se ha visto antes
            if (!sessionStorage.getItem('fvBannerVisto')) {
                setTimeout(lanzarBanner, 500); 
            }
        }
    }, 100);

    // Eventos de cierre
    if (btnCerrar) btnCerrar.onclick = cerrarTodo;
    if (btnPicar) btnPicar.onclick = cerrarTodo;
    if (bg) bg.onclick = cerrarTodo;
});