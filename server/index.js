import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { config, credentialStatus, logStartupConfig } from './config.js';
import { CONTENT_PRESETS } from '../shared/contentLibrary.js';
import { initScheduler, getSchedulerState } from './scheduler.js';
import { publishPreset, findPreset, ensureAssetsDir, presetForDate } from './publisher.js';
import { renderPostSvg, renderPostPng } from './canvasRenderer.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, '../dist');

const app = express();
app.use(cors());
app.use(express.json());

ensureAssetsDir();

// --- API -------------------------------------------------------------------

app.get('/api/health', (req, res) => {
  const status = credentialStatus();
  res.json({
    status: 'ok',
    app: 'PiggyMath Auto-Post Engine',
    presets: CONTENT_PRESETS.length,
    // Real state, not a hardcoded "Connected". The dashboard reads this.
    instagram: status.instagram,
    pinterest: status.pinterest,
    dryRun: status.dryRun,
    publicBaseUrl: status.publicBaseUrl,
    publicBaseUrlReachable: status.publicBaseUrlReachable,
    scheduler: getSchedulerState()
  });
});

app.get('/api/presets', (req, res) => {
  res.json({ presets: CONTENT_PRESETS, today: presetForDate().id });
});

// Render a card on demand without publishing. Useful for previewing exactly
// what the auto-poster would send.
app.get('/api/preview/:presetId.:ext(png|svg)', (req, res) => {
  const preset = findPreset(req.params.presetId);
  if (!preset) return res.status(404).json({ error: `Unknown preset "${req.params.presetId}"` });
  try {
    if (req.params.ext === 'svg') {
      res.type('image/svg+xml').send(renderPostSvg(preset, req.query.theme));
    } else {
      const png = renderPostPng(preset, req.query.theme);
      res.type('image/png').set('Content-Length', String(png.length)).send(png);
    }
  } catch (err) {
    res.status(500).json({ error: `Render failed: ${err.message}` });
  }
});

app.post('/api/publish-now', async (req, res) => {
  const { presetId } = req.body || {};

  // Previously an unknown id silently fell back to DAILY_TAX_CONTENT[0], so
  // every card in the UI published the day-1 self-employment-tax post.
  const preset = presetId ? findPreset(presetId) : presetForDate();
  if (!preset) {
    return res.status(400).json({
      success: false,
      error: `Unknown preset "${presetId}"`,
      validPresetIds: CONTENT_PRESETS.map(p => p.id)
    });
  }

  const status = credentialStatus();
  if (!status.anyReady && !config.dryRun) {
    return res.status(503).json({
      success: false,
      error: 'No social platform is configured on this server.',
      missing: { instagram: status.instagram.missing, pinterest: status.pinterest.missing },
      hint: 'Set these in the Render dashboard under Environment.'
    });
  }

  const forwardedProto = req.headers['x-forwarded-proto'];
  const proto = (Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto || req.protocol || 'https').split(',')[0].trim();
  const host = req.get('host');
  const baseUrl = host ? `${proto}://${host}` : config.publicBaseUrl;

  const result = await publishPreset(preset, { baseUrl, source: 'manual' });
  const published = result.instagram.success || result.pinterest.success;

  // The old handler returned success:true unconditionally, so the UI showed a
  // green banner even when both platforms failed.
  res.status(published || result.dryRun ? 200 : 502).json({
    success: published,
    dryRun: result.dryRun,
    presetId: preset.id,
    message: result.dryRun
      ? 'Dry run: card rendered, nothing posted.'
      : published
        ? 'Published.'
        : 'Publishing failed on every platform. See per-platform reason below.',
    imageUrl: result.imageUrl,
    instagram: result.instagram,
    pinterest: result.pinterest
  });
});

// --- Static frontend -------------------------------------------------------

app.use(express.static(DIST_DIR));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Unknown API route' });
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

app.listen(config.port, () => {
  console.log(`[PiggyMath] Server listening on port ${config.port}`);
  logStartupConfig();
  initScheduler();
});
