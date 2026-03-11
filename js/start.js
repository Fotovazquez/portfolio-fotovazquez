
  // 1. Buscamos el elemento loader
  const loader = document.getElementById('cine-loader');
  
  // 2. Miramos si ya se mostró en esta sesión
  const hasLoaded = sessionStorage.getItem('firstLoadDone');

  if (hasLoaded && loader) {
    // Si ya entró antes, lo borramos del mapa inmediatamente
    loader.style.display = 'none';
  } else {
    // Si es la primera vez, usamos el código que SÍ te funcionó
    window.addEventListener('load', function() {
      if (loader) {
        // Damos un pequeño margen de 500ms para que la entrada no sea brusca
        setTimeout(() => {
          loader.classList.add('fade-out');
          
          // Guardamos que ya se mostró para la próxima vez
          sessionStorage.setItem('firstLoadDone', 'true');
          
          // Lo eliminamos tras la animación
          setTimeout(() => {
            loader.style.display = 'none';
          }, 700);
        }, 500);
      }
    });
  }
