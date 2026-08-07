const token = process.env.IG_ACCESS_TOKEN || '';

async function test() {
  if (!token) return console.log('Set IG_ACCESS_TOKEN in .env');
  const res = await fetch(`https://graph.facebook.com/v19.0/me?fields=id,name,permissions&access_token=${token}`);
  const data = await res.json();
  console.log('User info:', data);
}

test();
