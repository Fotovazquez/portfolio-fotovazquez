export default async function handler(req, res) {
  // CORS (opcional si solo lo llamas desde tu mismo dominio, pero bueno para Vercel)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Para que funcione de forma gratuita de la forma más robusta posible,
    // usamos una API gratuita de RapidAPI de scraping de Instagram.
    // La mayoría ofrecen un plan "Basic" gratis de 50-100 request/mes que, a 1 req cada 48h (15/mes), sobra.
    // Ej: API "Instagram Scraper API" by "social-api" o similares.
    // Tienes que registrarte en rapidapi.com, escoger una API de IG gratuita y poner sus datos aquí:
    
    // API EJEMPLO (debes cambiar al endpoint de tu API gratuita de RapidAPI tras crear la cuenta)
    // API de RapidAPI (instagram-scraper21)
    const RAPID_API_KEY = process.env.RAPIDAPI_KEY; 

    // MODIFICAR LÍMITE: Intentamos pedir 100, pero ten en cuenta que las APIs gratuitas suelen capar y devolver 12 o 30 fotos por llamada por seguridad de Instagram.
    const url = 'https://instagram-scraper21.p.rapidapi.com/api/v1/full-posts?username=fotovazquez&limit=100';

    // ==========================================
    // DICCIONARIO MANUAL DE COLABORACIONES (FOTOVAZQUEZ)
    // ==========================================
    // ESTA ES LA FORMA DE PONER TUS COLABORADORES MANUALMENTE:
    // Solo tienes que ir a la foto en tu Instagram, por ejemplo:
    // https://www.instagram.com/p/DFxX3Y7t8wA/
    // Copias el código, que en ese caso es "DFxX3Y7t8wA"
    // Y lo pegas aquí abajo siguiendo este mismo formato exacto:
    const colaboradoresManuales = {
      // 1. Quita las barras dobles de abajo para activar este ejemplo
       "DWn0W4vjB-X": {
         name: "Lucía Martín",
         handle: "@luucia.maartiin"
       },
      
      // 2. Puedes añadir todas las que quieras poniéndoles una coma al final
      "CODIGO_DE_TU_FOTO_AQUI": {
        name: "Proyecto Fotovazquez",
        handle: "@fotovazquez"
      }
    };
    
    // Si no hay key configurada, rompemos para caer al fallback
    if (!RAPID_API_KEY) {
      throw new Error('No RAPIDAPI_KEY configured');
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPID_API_KEY,
        'X-RapidAPI-Host': 'instagram-scraper21.p.rapidapi.com' // Ajuste para instagram-scraper21
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error('Error al obtener datos de la API de Instagram: ' + response.status + ' ' + errText);
    }

    const data = await response.json();
    
    // data.data.posts es donde viene la respuesta estructurada de instagram-scraper21
    const allPosts = data.data?.posts || [];

    // Mapeo inicial de los valores devueltos por la API
    let parsedPosts = allPosts.map(item => {
      const linkUrl = item.code ? `https://www.instagram.com/p/${item.code}/` : null;
      
      return {
        id: item.id || item.pk,
        code: item.code, // guardamos el corto del enlace para fácil uso
        link: linkUrl,
        image_url: item.image_versions2?.candidates?.[0]?.url,
        likes: item.like_count || 0,
        caption: item.caption?.text || ''
      };
    });

    // 1. Quitar los nulos
    parsedPosts = parsedPosts.filter(p => p.image_url);

    // 2. Ordenar por likes (descendente)
    const sortedPosts = parsedPosts.sort((a, b) => b.likes - a.likes);

    // 3. Obtener el Top 10 y darle formato para nuestro Frontend
    const top10 = sortedPosts.slice(0, 10).map(post => {
      // 1. Extraemos la mención dinámica del texto
      const mentionMatch = post.caption ? post.caption.match(/@([\w.-]+)/) : null;
      let detectedHandle = mentionMatch ? `@${mentionMatch[1]}` : null;
      
      // 2. Buscamos si la hemos anulado manualmente en el Diccionario (por ID o Codigo del enlace)
      const forcedCollab = colaboradoresManuales[post.id] || colaboradoresManuales[post.code];

      // 3. Variables finales
      let finalHandle = '@fotovazquez'; // si no hay nada, el tuyo
      let finalName = 'Fotografía Autor';

      if (forcedCollab) {
        // Prioridad 1: Configuración Manual arriba
        finalHandle = forcedCollab.handle;
        finalName = forcedCollab.name;
      } else if (detectedHandle) {
        // Prioridad 2: La primera cuenta @mencionada en tu texto
        finalHandle = detectedHandle;
        finalName = detectedHandle.replace('@', ''); // Nombre simulado
      }

      return {
        id: post.id,
        link: post.link,
        image_url: post.image_url,
        likes: post.likes,
        instagram_handle: finalHandle,
        name: finalName 
      };
    });

    if (top10.length === 0) {
      throw new Error('No se encontraron posts');
    }

    // CACHÉ DE 48 HORAS (172800 segundos) en el Edge Network de Vercel. 
    // stale-while-revalidate sirve vieja caché mientras actualiza en background
    res.setHeader('Cache-Control', 'public, s-maxage=172800, stale-while-revalidate=86400');
    
    return res.status(200).json({ success: true, top10 });
    
  } catch (error) {
    // Extra debugging para saber qué falló en Vercel
    const errorMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ success: false, error: 'Failed to fetch Data', detail: errorMsg });
  }
}
