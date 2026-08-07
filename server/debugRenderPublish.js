async function debugRenderPublish() {
  console.log('Testing live Publish-Now on Render...');
  try {
    const res = await fetch('https://piggymath-social-studio.onrender.com/api/publish-now', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ presetId: 'se-tax-trap-153' })
    });
    console.log('Status code:', res.status);
    const data = await res.json();
    console.log('Response body:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

debugRenderPublish();
