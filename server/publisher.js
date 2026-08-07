// The single publish pipeline.
//
// Both the manual /api/publish-now route and the daily cron call publishPreset().
// They used to be separate implementations: the route used a hardcoded token and
// the rendered card, the cron used process.env and a static og.png. That is why
// the scheduler could report success for months while posting nothing.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config, credentialStatus } from './config.js';
import { CONTENT_PRESETS } from '../shared/contentLibrary.js';
import { renderPostPng } from './canvasRenderer.js';
import { publishToInstagram } from './api/instagram.js';
import { publishToPinterest } from './api/pinterest.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ASSETS_DIR = path.join(__dirname, '../dist/assets');

export function ensureAssetsDir() {
  if (!fs.existsSync(ASSETS_DIR)) fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

export function findPreset(presetId) {
  return CONTENT_PRESETS.find(p => p.id === presetId) || null;
}

/** Deterministic day-of-year rotation. The old scheduler kept an in-memory
 *  counter that reset to 0 on every container restart, so the cycle restarted
 *  at post #1 on each deploy and each idle spin-down. */
export function presetForDate(date = new Date()) {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const dayOfYear = Math.floor((Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) - start) / 86400000);
  return CONTENT_PRESETS[dayOfYear % CONTENT_PRESETS.length];
}

/**
 * Render the card, write it where Express serves it, and publish to both
 * platforms. Returns a per-platform result; never claims success on behalf of
 * a platform that was not actually called.
 *
 * @param {object} preset  a preset object from shared/contentLibrary.js
 * @param {object} [opts]
 * @param {string} [opts.baseUrl]  overrides config.publicBaseUrl (request host)
 * @param {string} [opts.source]   'manual' | 'cron', for logging
 */
export async function publishPreset(preset, opts = {}) {
  const baseUrl = (opts.baseUrl || config.publicBaseUrl).replace(/\/+$/, '');
  const source = opts.source || 'manual';
  const status = credentialStatus();
  const startedAt = new Date().toISOString();

  const result = {
    presetId: preset.id,
    source,
    startedAt,
    imageUrl: null,
    dryRun: config.dryRun,
    instagram: { success: false, skipped: true, reason: 'not attempted' },
    pinterest: { success: false, skipped: true, reason: 'not attempted' },
    get published() { return this.instagram.success || this.pinterest.success; }
  };

  // 1. Render the card.
  ensureAssetsDir();
  const fileName = `card-${preset.id}.png`;
  const filePath = path.join(ASSETS_DIR, fileName);
  try {
    fs.writeFileSync(filePath, renderPostPng(preset));
    console.log(`[Publish:${source}] Rendered ${fileName} for "${preset.mainHeading}"`);
  } catch (err) {
    // A render failure used to be logged and then ignored, so we published a
    // URL pointing at a file that was never written. Abort instead.
    console.error(`[Publish:${source}] Card render FAILED:`, err);
    result.instagram = { success: false, skipped: true, reason: `card render failed: ${err.message}` };
    result.pinterest = { ...result.instagram };
    result.error = `Card render failed: ${err.message}`;
    return result;
  }

  const imageUrl = `${baseUrl}/assets/${fileName}`;
  result.imageUrl = imageUrl;

  if (!status.publicBaseUrlReachable && !config.dryRun) {
    const reason = `image URL is not publicly reachable (${imageUrl}); set PUBLIC_BASE_URL`;
    console.error(`[Publish:${source}] ${reason}`);
    result.instagram = { success: false, skipped: true, reason };
    result.pinterest = { success: false, skipped: true, reason };
    result.error = reason;
    return result;
  }

  if (config.dryRun) {
    const reason = 'DRY_RUN=true';
    console.log(`[Publish:${source}] ${reason} — rendered ${imageUrl} but not posting.`);
    result.instagram = { success: false, skipped: true, dryRun: true, reason };
    result.pinterest = { success: false, skipped: true, dryRun: true, reason };
    return result;
  }

  // 2. Instagram.
  if (!status.instagram.ready) {
    const reason = `missing ${status.instagram.missing.join(', ')}`;
    console.error(`[Publish:${source}] Instagram skipped — ${reason}`);
    result.instagram = { success: false, skipped: true, reason };
  } else {
    result.instagram = await publishToInstagram({
      igUserId: config.igUserId,
      accessToken: config.igAccessToken,
      imageUrl,
      caption: preset.igCaption
    });
  }

  // 3. Pinterest.
  if (!status.pinterest.ready) {
    const reason = `missing ${status.pinterest.missing.join(', ')}`;
    console.error(`[Publish:${source}] Pinterest skipped — ${reason}`);
    result.pinterest = { success: false, skipped: true, reason };
  } else {
    result.pinterest = await publishToPinterest({
      accessToken: config.pinterestAccessToken,
      boardId: config.pinterestBoardId,
      boardName: config.pinterestBoardName,
      imageUrl,
      title: preset.pinTitle || preset.mainHeading,
      description: preset.pinterestDescription
    });
  }

  const plain = {
    instagram: result.instagram,
    pinterest: result.pinterest,
    published: result.instagram.success || result.pinterest.success
  };
  console.log(`[Publish:${source}] Result for ${preset.id}:`, JSON.stringify(plain));
  return result;
}
