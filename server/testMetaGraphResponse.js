async function testMetaGraphResponse() {
  console.log('Sending POST request to https://piggymath-social-studio.onrender.com/api/publish-now ...');
  try {
    const res = await fetch('https://piggymath-social-studio.onrender.com/api/publish-now', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ presetId: 'se-tax-trap-153' })
    });
    const data = await res.json();
    console.log('API Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error fetching endpoint:', err);
  }
}

testMetaGraphResponse();
