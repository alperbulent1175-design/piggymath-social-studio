// Meta Graph API publisher for Instagram Business.
//
// NOTE: this module never invents success. It previously returned
// { success: true, simulated: true } when credentials were missing, which is
// how the daily cron reported healthy results while posting nothing.
// Credential checks now happen in publisher.js; simulation is DRY_RUN only.

const GRAPH_VERSION = 'v19.0';

async function graphPost(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  let data;
  try {
    data = await res.json();
  } catch {
    data = { error: { message: `Non-JSON response (HTTP ${res.status})` } };
  }
  return { ok: res.ok, status: res.status, data };
}

function metaError(data, fallback) {
  const e = data && data.error;
  if (!e) return fallback;
  const parts = [e.message, e.code !== undefined ? `code ${e.code}` : null, e.error_subcode ? `subcode ${e.error_subcode}` : null]
    .filter(Boolean);
  return parts.join(' — ') || fallback;
}

/**
 * Two-step publish: create a media container, wait for Meta to fetch and
 * process the image, then publish the container.
 */
export async function publishToInstagram({ igUserId, accessToken, imageUrl, caption }) {
  if (!igUserId || !accessToken) {
    return { success: false, skipped: true, reason: 'IG_USER_ID or IG_ACCESS_TOKEN not set' };
  }

  try {
    console.log(`[Instagram] Creating media container for ${imageUrl}`);
    const container = await graphPost(
      `https://graph.facebook.com/${GRAPH_VERSION}/${igUserId}/media`,
      { image_url: imageUrl, caption, access_token: accessToken }
    );

    if (!container.data.id) {
      const reason = metaError(container.data, `container creation failed (HTTP ${container.status})`);
      console.error('[Instagram] Container creation failed:', reason);
      return { success: false, stage: 'container', reason, raw: container.data };
    }

    const creationId = container.data.id;

    // Meta downloads and processes the image asynchronously. Publishing too
    // early returns "Media ID is not available". Poll the container status
    // instead of the old fixed 4s sleep, which was both slower than needed on
    // a good day and too short on a bad one.
    const ready = await waitForContainer(creationId, accessToken);
    if (!ready.ok) {
      console.error('[Instagram] Container never became ready:', ready.reason);
      return { success: false, stage: 'processing', reason: ready.reason, containerId: creationId };
    }

    const published = await graphPost(
      `https://graph.facebook.com/${GRAPH_VERSION}/${igUserId}/media_publish`,
      { creation_id: creationId, access_token: accessToken }
    );

    if (!published.data.id) {
      const reason = metaError(published.data, `publish failed (HTTP ${published.status})`);
      console.error('[Instagram] Publish failed:', reason);
      return { success: false, stage: 'publish', reason, containerId: creationId, raw: published.data };
    }

    console.log(`[Instagram] Published media ${published.data.id}`);
    return { success: true, mediaId: published.data.id, containerId: creationId };
  } catch (err) {
    console.error('[Instagram] Unexpected error:', err);
    return { success: false, stage: 'exception', reason: err.message };
  }
}

async function waitForContainer(creationId, accessToken, { attempts = 10, delayMs = 2000 } = {}) {
  for (let i = 0; i < attempts; i++) {
    await new Promise(r => setTimeout(r, delayMs));
    try {
      const res = await fetch(
        `https://graph.facebook.com/${GRAPH_VERSION}/${creationId}?fields=status_code,status&access_token=${encodeURIComponent(accessToken)}`
      );
      const data = await res.json();
      if (data.status_code === 'FINISHED') return { ok: true };
      if (data.status_code === 'ERROR' || data.status_code === 'EXPIRED') {
        return { ok: false, reason: `container ${data.status_code}: ${data.status || 'no detail'}` };
      }
      console.log(`[Instagram] Container ${creationId} status ${data.status_code || 'unknown'} (attempt ${i + 1}/${attempts})`);
    } catch (err) {
      console.warn('[Instagram] Status poll failed, retrying:', err.message);
    }
  }
  return { ok: false, reason: `container not FINISHED after ${attempts} polls` };
}
