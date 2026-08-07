async function testImageHeader() {
  const url = 'https://piggymath-social-studio.onrender.com/api/post-image/day-1-se-tax.png';
  const res = await fetch(url);
  console.log('Status:', res.status);
  console.log('Content-Type:', res.headers.get('content-type'));
  console.log('Content-Length:', res.headers.get('content-length'));
  
  const buffer = await res.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  console.log('Total Bytes:', bytes.length);
  console.log('PNG Header Signature (89 50 4E 47 0D 0A 1A 0A):', Array.from(bytes.slice(0, 8)).map(b => b.toString(16).padStart(2, '0')).join(' '));
}

testImageHeader();
