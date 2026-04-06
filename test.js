const RAPID_API_KEY = '2855dc7a3emsh893c61563b3be96p1ba884jsn5cecabe1eb5a';
const url = 'https://instagram-scraper21.p.rapidapi.com/api/v1/full-posts?username=fotovazquez&limit=30';

async function testFetch() {
  console.log("STARTING FETCH...");
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': RAPID_API_KEY,
      'X-RapidAPI-Host': 'instagram-scraper21.p.rapidapi.com'
    }
  });
  console.log("STATUS:", response.status);
  const data = await response.json();
  
  const allPosts = data.data?.posts || [];
  console.log("FOUND POSTS:", allPosts.length);

  let parsedPosts = allPosts.map(item => {
    const linkUrl = item.code ? `https://www.instagram.com/p/${item.code}/` : null;
    return {
      id: item.id || item.pk,
      link: linkUrl,
      image_url: item.image_versions2?.candidates?.[0]?.url,
      likes: item.like_count || 0,
      caption: item.caption?.text || ''
    };
  });

  parsedPosts = parsedPosts.filter(p => p.image_url);
  const sortedPosts = parsedPosts.sort((a, b) => b.likes - a.likes);

  const top10 = sortedPosts.slice(0, 10).map(post => {
    const mentionMatch = post.caption ? post.caption.match(/@([\w.-]+)/) : null;
    let mention = mentionMatch ? mentionMatch[1] : 'fotovazquez';
    return {
      id: post.id,
      link: post.link,
      image_url: post.image_url,
      likes: post.likes,
      instagram_handle: `@${mention}`,
      name: 'Cliente' 
    };
  });

  console.log("TOP 10 RESULT:", JSON.stringify(top10, null, 2));
}

testFetch().catch(console.error);
