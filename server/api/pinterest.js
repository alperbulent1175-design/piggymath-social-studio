// Pinterest API v5 publisher.
//
// Two behaviours changed here:
//   1. The production endpoint is used. The old code tried
//      api-sandbox.pinterest.com FIRST and returned on the first success, so a
//      sandbox-scoped token produced "successful" pins that never appeared on
//      the live account. Sandbox is now opt-in via PINTEREST_SANDBOX=true.
//   2. The board is resolved by id, then by name. The old code took
//      items[0].id — whichever board the API happened to return first —
//      and ignored both the configured id and the board name entirely.

const PROD_BASE = 'https://api.pinterest.com/v5';
const SANDBOX_BASE = 'https://api-sandbox.pinterest.com/v5';

function baseUrl() {
  return String(process.env.PINTEREST_SANDBOX || '').toLowerCase() === 'true' ? SANDBOX_BASE : PROD_BASE;
}

async function pinterestFetch(base, pathname, accessToken, init = {}) {
  const res = await fetch(`${base}${pathname}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...(init.headers || {})
    }
  });
  let data;
  try {
    data = await res.json();
  } catch {
    data = { message: `Non-JSON response (HTTP ${res.status})` };
  }
  return { ok: res.ok, status: res.status, data };
}

function pinterestError(status, data, fallback) {
  const msg = data && (data.message || data.error_description || data.error);
  const code = data && data.code !== undefined ? ` (code ${data.code})` : '';
  return msg ? `${msg}${code}` : `${fallback} (HTTP ${status})`;
}

/** Resolve the target board: configured id -> name match -> create it. */
async function resolveBoard(base, accessToken, boardId, boardName) {
  if (boardId) {
    const res = await pinterestFetch(base, `/boards/${encodeURIComponent(boardId)}`, accessToken);
    if (res.ok && res.data.id) {
      console.log(`[Pinterest] Using configured board "${res.data.name}" (${res.data.id})`);
      return { id: res.data.id, name: res.data.name };
    }
    console.warn(`[Pinterest] PINTEREST_BOARD_ID=${boardId} not usable: ${pinterestError(res.status, res.data, 'lookup failed')}. Falling back to name match.`);
  }

  const list = await pinterestFetch(base, '/boards?page_size=100', accessToken);
  if (!list.ok) {
    return { error: pinterestError(list.status, list.data, 'could not list boards') };
  }

  const items = Array.isArray(list.data.items) ? list.data.items : [];
  const wanted = String(boardName || '').trim().toLowerCase();
  const match = items.find(b => String(b.name || '').trim().toLowerCase() === wanted);
  if (match) {
    console.log(`[Pinterest] Matched board by name: "${match.name}" (${match.id})`);
    return { id: match.id, name: match.name };
  }

  console.log(`[Pinterest] No board named "${boardName}" among ${items.length} boards. Creating it.`);
  const created = await pinterestFetch(base, '/boards', accessToken, {
    method: 'POST',
    body: JSON.stringify({
      name: boardName,
      description: 'Daily self-employment tax tips, 1099 calculators, and financial guides for freelancers.',
      privacy: 'PUBLIC'
    })
  });
  if (created.ok && created.data.id) {
    console.log(`[Pinterest] Created board "${boardName}" (${created.data.id}). Set PINTEREST_BOARD_ID=${created.data.id} to skip this lookup.`);
    return { id: created.data.id, name: boardName, created: true };
  }
  return { error: pinterestError(created.status, created.data, 'board creation failed') };
}

export async function publishToPinterest({
  accessToken,
  boardId,
  boardName = 'PiggyMath Tax & Money Tips',
  imageUrl,
  title,
  description,
  link = 'https://piggymath.com/'
}) {
  if (!accessToken) {
    return { success: false, skipped: true, reason: 'PINTEREST_ACCESS_TOKEN not set' };
  }

  const base = baseUrl();
  if (base === SANDBOX_BASE) {
    console.warn('[Pinterest] PINTEREST_SANDBOX=true — pins will NOT appear on the live account.');
  }

  try {
    const board = await resolveBoard(base, accessToken, boardId, boardName);
    if (board.error) {
      console.error('[Pinterest] Board resolution failed:', board.error);
      return { success: false, stage: 'board', reason: board.error };
    }

    const pin = await pinterestFetch(base, '/pins', accessToken, {
      method: 'POST',
      body: JSON.stringify({
        board_id: board.id,
        title: title ? String(title).slice(0, 100) : undefined,
        description: description ? String(description).slice(0, 800) : undefined,
        link,
        media_source: { source_type: 'image_url', url: imageUrl }
      })
    });

    if (!pin.ok || !pin.data.id) {
      const reason = pinterestError(pin.status, pin.data, 'pin creation failed');
      console.error('[Pinterest] Pin creation failed:', reason);
      return { success: false, stage: 'pin', reason, boardId: board.id, sandbox: base === SANDBOX_BASE, raw: pin.data };
    }

    console.log(`[Pinterest] Published pin ${pin.data.id} to board ${board.id}`);
    return { success: true, pinId: pin.data.id, boardId: board.id, boardName: board.name, sandbox: base === SANDBOX_BASE };
  } catch (err) {
    console.error('[Pinterest] Unexpected error:', err);
    return { success: false, stage: 'exception', reason: err.message };
  }
}
