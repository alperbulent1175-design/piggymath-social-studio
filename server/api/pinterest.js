// Pinterest API v5 Publisher

export async function publishToPinterest({ accessToken, boardId, imageUrl, title, description, link = 'https://piggymath.com/' }) {
  if (!accessToken || !boardId) {
    console.log('[Pinterest API] Missing credentials, running in simulated auto-post mode.');
    return { success: true, simulated: true, pinId: 'sim_pin_' + Date.now() };
  }

  try {
    const pinUrl = 'https://api.pinterest.com/v5/pins';
    const res = await fetch(pinUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        board_id: boardId,
        title: title,
        description: description,
        link: link,
        media_source: {
          source_type: 'image_url',
          url: imageUrl
        }
      })
    });

    const data = await res.json();
    return { success: true, pinId: data.id };
  } catch (err) {
    console.error('[Pinterest API Error]', err);
    return { success: false, error: err.message };
  }
}
