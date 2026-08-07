const newToken = 'EAAN6rC7PlH8BSIhCDM5DKp6SmTEMAsyQDYXUekIvMOsOlRKpLbwfndkIfFYZBxld6hIC0NXnSQ707w9VmNrfBs6a3Q9qV6778IvNZAqcYJuurTkjuLnjcZAab0CwvyoZB6xCzSiiMQQi8ZC29iZAAhAKHD5SvNn0gsn0VGUwXOJlffDhS5awawqxuzNt6an1hibZBMndkNGl7ZAsysNc';
const igUserId = '17841438053748611';

async function testNewToken() {
  console.log('Testing Extended Token...');
  const debugRes = await fetch(`https://graph.facebook.com/v19.0/debug_token?input_token=${newToken}&access_token=${newToken}`);
  const debugData = await debugRes.json();
  console.log('Token Debug Info:', JSON.stringify(debugData, null, 2));

  const igRes = await fetch(`https://graph.facebook.com/v19.0/${igUserId}?fields=id,username,name&access_token=${newToken}`);
  const igData = await igRes.json();
  console.log('Instagram Account:', JSON.stringify(igData, null, 2));
}

testNewToken();
