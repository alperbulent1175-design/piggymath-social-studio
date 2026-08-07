const pinToken = process.env.PINTEREST_ACCESS_TOKEN || '';

async function testPin() {
  if (!pinToken) return console.log('Set PINTEREST_ACCESS_TOKEN in .env');
  const userRes = await fetch('https://api.pinterest.com/v5/user_account', {
    headers: { 'Authorization': `Bearer ${pinToken}` }
  });
  const userData = await userRes.json();
  console.log('Pinterest User Account:', userData);
}

testPin();
