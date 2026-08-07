async function testLivePublish() {
  const res = await fetch('https://piggymath-social-studio.onrender.com/api/publish-now', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ presetId: 'se-tax-trap-153' })
  });
  const data = await res.json();
  console.log('Live Render Cloud Publish Result:', JSON.stringify(data, null, 2));
}

testLivePublish();
