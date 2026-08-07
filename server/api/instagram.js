// Meta Graph API Publisher for Instagram

export async function publishToInstagram({ igUserId, accessToken, imageUrl, caption }) {
  if (!igUserId || !accessToken) {
    console.log('[Instagram API] Missing API credentials, running in simulated auto-post mode.');
    return { success: true, simulated: true, mediaId: 'sim_ig_' + Date.now() };
  }

  try {
    console.log(`[Instagram API] Step 1: Creating media container for URL: ${imageUrl}...`);
    
    // Step 1: Create Container
    const containerUrl = `https://graph.facebook.com/v19.0/${igUserId}/media`;
    const containerRes = await fetch(containerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: imageUrl,
        caption: caption,
        access_token: accessToken
      })
    });
    const containerData = await containerRes.json();

    if (!containerData.id) {
      throw new Error(`IG Container creation failed: ${JSON.stringify(containerData)}`);
    }

    console.log(`[Instagram API] Container created ID: ${containerData.id}. Waiting 4 seconds for Meta image pipeline processing...`);
    
    // Wait 4 seconds for Meta's async image download & processing pipeline
    await new Promise(resolve => setTimeout(resolve, 4000));

    // Step 2: Publish Container
    console.log(`[Instagram API] Step 2: Publishing container ID: ${containerData.id}...`);
    const publishUrl = `https://graph.facebook.com/v19.0/${igUserId}/media_publish`;
    const publishRes = await fetch(publishUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: containerData.id,
        access_token: accessToken
      })
    });
    const publishData = await publishRes.json();

    if (!publishData.id) {
      throw new Error(`IG Container publish failed: ${JSON.stringify(publishData)}`);
    }

    console.log(`[Instagram API] LIVE POST SUCCESS! Published Media ID: ${publishData.id}`);
    return { success: true, mediaId: publishData.id };
  } catch (err) {
    console.error('[Instagram API Error]', err);
    return { success: false, error: err.message };
  }
}
