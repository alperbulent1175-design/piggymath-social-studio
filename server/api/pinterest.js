// Pinterest API v5 Publisher with Automatic Board Creation

export async function publishToPinterest({ accessToken, boardId, imageUrl, title, description, link = 'https://piggymath.com/' }) {
  if (!accessToken) {
    console.log('[Pinterest API] Missing access token, running in simulated mode.');
    return { success: true, simulated: true, pinId: 'sim_pin_' + Date.now() };
  }

  const endpoints = [
    'https://api-sandbox.pinterest.com/v5',
    'https://api.pinterest.com/v5'
  ];

  for (const baseUrl of endpoints) {
    try {
      console.log(`[Pinterest API] Trying endpoint ${baseUrl}...`);

      let targetBoardId = boardId;

      // Check existing boards
      const bRes = await fetch(`${baseUrl}/boards`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      const bData = await bRes.json();

      if (bData.items && bData.items.length > 0) {
        targetBoardId = bData.items[0].id;
        console.log(`[Pinterest API] Found target board: ${bData.items[0].name} (ID: ${targetBoardId})`);
      } else if (!targetBoardId || targetBoardId === 'PiggyMath Financial Tips') {
        // Create Board automatically if none exists
        console.log('[Pinterest API] Creating automatic board: "PiggyMath Tax & Money Tips"...');
        const createBRes = await fetch(`${baseUrl}/boards`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: 'PiggyMath Tax & Money Tips',
            description: 'Daily self-employment tax tips, 1099 calculators, and financial guides for freelancers.',
            privacy: 'PUBLIC'
          })
        });
        const createBData = await createBRes.json();
        if (createBData.id) {
          targetBoardId = createBData.id;
          console.log(`[Pinterest API] Created new Board ID: ${targetBoardId}`);
        }
      }

      if (!targetBoardId) continue;

      // Try creating Pin with primary visual image, fallback to og.png if broken
      const validImageUrl = imageUrl && !imageUrl.includes('localhost') ? imageUrl : 'https://piggymath.com/assets/og.png';
      
      console.log(`[Pinterest API] Creating Pin in Board ${targetBoardId} with image: ${validImageUrl}...`);
      const pinRes = await fetch(`${baseUrl}/pins`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          board_id: targetBoardId,
          title: title,
          description: description,
          link: link,
          media_source: {
            source_type: 'image_url',
            url: validImageUrl
          }
        })
      });

      const pinData = await pinRes.json();

      // If image URL failed crawler check, retry with og.png fallback
      if (pinData.code === 235 && validImageUrl !== 'https://piggymath.com/assets/og.png') {
        console.log('[Pinterest API] Retrying Pin creation with og.png fallback image...');
        const retryRes = await fetch(`${baseUrl}/pins`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            board_id: targetBoardId,
            title: title,
            description: description,
            link: link,
            media_source: {
              source_type: 'image_url',
              url: 'https://piggymath.com/assets/og.png'
            }
          })
        });
        const retryData = await retryRes.json();
        if (retryData.id) {
          console.log(`[Pinterest API] LIVE PIN SUCCESS! Pin ID: ${retryData.id}`);
          return { success: true, pinId: retryData.id, boardId: targetBoardId };
        }
      }

      if (pinData.id) {
        console.log(`[Pinterest API] LIVE PIN SUCCESS! Pin ID: ${pinData.id}`);
        return { success: true, pinId: pinData.id, boardId: targetBoardId };
      }

    } catch (err) {
      console.error(`[Pinterest API Error on ${baseUrl}]`, err);
    }
  }

  return { success: false, error: 'Failed to create pin on Pinterest endpoints' };
}
