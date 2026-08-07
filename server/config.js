// Central runtime configuration.
//
// SECURITY: credentials live in environment variables ONLY. Never commit a
// token to this repository, in any form. Base64 is encoding, not encryption —
// if the server can decode it, so can anyone who clones the repo, and it also
// defeats GitHub Push Protection, which is the mechanism that would otherwise
// tell Meta/Pinterest to auto-revoke a leaked token.
//
// Set these in the Render dashboard (Environment tab), or in a local .env that
// is git-ignored. See .env.example.

function env(name, fallback = undefined) {
  const raw = process.env[name];
  if (raw === undefined || raw.trim() === '') return fallback;
  return raw.trim();
}

// Public, non-secret identifiers. Safe to have defaults.
const IG_USER_ID = env('IG_USER_ID', '17841438053748611');
const FACEBOOK_PAGE_ID = env('FACEBOOK_PAGE_ID', '1160207883850934');
const PINTEREST_BOARD_NAME = env('PINTEREST_BOARD_NAME', 'PiggyMath Tax & Money Tips');

// Secrets. No defaults, ever.
const IG_ACCESS_TOKEN = env('IG_ACCESS_TOKEN');
const PINTEREST_ACCESS_TOKEN = env('PINTEREST_ACCESS_TOKEN');

// Pinterest board id is an opaque numeric string, not a board name. If it is
// missing we fall back to matching PINTEREST_BOARD_NAME, then to creating it.
const PINTEREST_BOARD_ID = env('PINTEREST_BOARD_ID');

// Base URL the social platforms will fetch card images from. Required for the
// cron path, which has no incoming request to derive a host from. Render sets
// RENDER_EXTERNAL_URL automatically.
const PUBLIC_BASE_URL = (
  env('PUBLIC_BASE_URL') ||
  env('RENDER_EXTERNAL_URL') ||
  'http://localhost:4000'
).replace(/\/+$/, '');

// When true, the publish pipeline runs end to end (render, write PNG, build
// payloads) but stops short of calling the social APIs. Use it to test without
// posting. This is the ONLY way to get a simulated result — a missing token is
// treated as a hard failure, not as a silent success.
const DRY_RUN = env('DRY_RUN', 'false').toLowerCase() === 'true';

const POST_CRON = env('POST_CRON', '0 9 * * *');
const POST_TIMEZONE = env('POST_TIMEZONE', 'America/New_York');

export const config = {
  port: Number(env('PORT', '4000')),
  igUserId: IG_USER_ID,
  igAccessToken: IG_ACCESS_TOKEN,
  facebookPageId: FACEBOOK_PAGE_ID,
  pinterestAccessToken: PINTEREST_ACCESS_TOKEN,
  pinterestBoardId: PINTEREST_BOARD_ID,
  pinterestBoardName: PINTEREST_BOARD_NAME,
  publicBaseUrl: PUBLIC_BASE_URL,
  dryRun: DRY_RUN,
  postCron: POST_CRON,
  postTimezone: POST_TIMEZONE
};

/**
 * Which platforms are actually configured, and why not if not.
 * The server still boots without credentials — the dashboard stays usable —
 * but publishing reports a specific, visible reason instead of pretending.
 */
export function credentialStatus() {
  const instagram = { ready: false, missing: [] };
  if (!config.igUserId) instagram.missing.push('IG_USER_ID');
  if (!config.igAccessToken) instagram.missing.push('IG_ACCESS_TOKEN');
  instagram.ready = instagram.missing.length === 0;

  const pinterest = { ready: false, missing: [] };
  if (!config.pinterestAccessToken) pinterest.missing.push('PINTEREST_ACCESS_TOKEN');
  pinterest.ready = pinterest.missing.length === 0;

  const baseUrlIsLocal = /localhost|127\.0\.0\.1/.test(config.publicBaseUrl);

  return {
    instagram,
    pinterest,
    dryRun: config.dryRun,
    publicBaseUrl: config.publicBaseUrl,
    // Meta and Pinterest both fetch the image over the public internet. A
    // localhost base URL cannot work in production, so surface it clearly
    // rather than letting the crawler fail with an opaque error.
    publicBaseUrlReachable: !baseUrlIsLocal,
    anyReady: instagram.ready || pinterest.ready
  };
}

/** Logged once at boot so a misconfigured deploy is obvious in the Render logs. */
export function logStartupConfig() {
  const status = credentialStatus();
  console.log('[Config] Public base URL:', config.publicBaseUrl);
  console.log('[Config] Instagram:', status.instagram.ready
    ? `ready (user ${config.igUserId})`
    : `NOT CONFIGURED — missing ${status.instagram.missing.join(', ')}`);
  console.log('[Config] Pinterest:', status.pinterest.ready
    ? `ready (board ${config.pinterestBoardId || `by name "${config.pinterestBoardName}"`})`
    : `NOT CONFIGURED — missing ${status.pinterest.missing.join(', ')}`);
  if (config.dryRun) {
    console.warn('[Config] DRY_RUN=true — nothing will actually be posted.');
  }
  if (!status.publicBaseUrlReachable) {
    console.warn(`[Config] PUBLIC_BASE_URL is ${config.publicBaseUrl}. Social platforms cannot fetch images from localhost; publishing will fail.`);
  }
  if (!status.anyReady && !config.dryRun) {
    console.error('[Config] No platform is configured. Scheduled posts will FAIL (not silently succeed). Set the missing variables in the Render dashboard.');
  }
}
