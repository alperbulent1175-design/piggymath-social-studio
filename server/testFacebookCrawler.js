async function testFacebookCrawler() {
  const url = 'https://piggymath-social-studio.onrender.com/api/post-image/day-1-se-tax.png';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
      'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
    }
  });
  console.log('Crawler Status:', res.status);
  console.log('Crawler Content-Type:', res.headers.get('content-type'));
  console.log('Crawler Content-Length:', res.headers.get('content-length'));
  
  const buffer = await res.arrayBuffer();
  console.log('Crawler Received Bytes:', buffer.byteLength);
}

testFacebookCrawler();
