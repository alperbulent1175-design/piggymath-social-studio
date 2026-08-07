async function testRenderLivePublish() {
  console.log('Sending POST to https://piggymath-social-studio.onrender.com/api/publish-now ...');
  try {
    const res = await fetch('https://piggymath-social-studio.onrender.com/api/publish-now', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ presetId: 'se-tax-trap-153' })
    });
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Render Live Publish Output:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testRenderLivePublish();
