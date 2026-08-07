import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initScheduler } from './scheduler.js';
import { DAILY_TAX_CONTENT } from './contentLibrary.js';
import { publishToInstagram } from './api/instagram.js';
import { publishToPinterest } from './api/pinterest.js';
import { renderPostSvg, renderPostPng } from './canvasRenderer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Extended 60-Day / Never Expiring Fallback Meta & Pinterest Tokens
const DEFAULT_IG_TOKEN = Buffer.from('RUFBTjZyQzdQbEg4QlNJaENETTVES3A2U21URU1Bc3lRRFlYVWVrSXZNT3NPbFJLcExid2ZuZGtJZkZZWkJ4bGQ2aElDME5YblNRNzA3dzlWbU5yZkJzNmEzUTlxVjY3NzhJdk5aQXFjWUp1dXJUa2p1TG5qY1pBYWIwQ3d2eW9aQjZ4Q3pTaWlNUVFpOFpDMjlpWkFBaEFLSERTVnZOMjBnc24wVkdVd1hPSmZmRGhTNWF3YXdxeHV6TnQ2YW4xaGliWkJNbmRrTkdsN1pBc3lzTmM=', 'base64').toString('utf-8');
const DEFAULT_PIN_TOKEN = Buffer.from('cGluYV9BTUFYWVpBWUFCSVpPQ0FBR0NBQjZENU9MVFk1WkhZQlFCSVFDNVpFSFg0UEJYTTVRRkJOSkxQSjVHUTNRVzRaT0NTR0RaN1RGS1VRRFFPT1daNkhMVkRLUkZWSkk2UUE=', 'base64').toString('utf-8');

// API Routes FIRST
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'PiggyMath Auto-Post Engine 24/7' });
});

app.get('/api/presets', (req, res) => {
  res.json({ presets: DAILY_TAX_CONTENT });
});

// Dynamic Visual PNG Post Infographic Image Route for Meta & Pinterest
app.get('/api/post-image/:presetId.png', (req, res) => {
  try {
    const cleanId = req.params.presetId.replace(/\.png|\.svg/, '');
    const pngBuffer = renderPostPng(cleanId);
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(pngBuffer);
  } catch (err) {
    console.error('PNG render error:', err);
    res.status(500).send('Image render error');
  }
});

app.get('/api/post-image/:presetId', (req, res) => {
  try {
    const cleanId = req.params.presetId.replace(/\.png|\.svg/, '');
    const pngBuffer = renderPostPng(cleanId);
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(pngBuffer);
  } catch (err) {
    console.error('PNG render error:', err);
    res.status(500).send('Image render error');
  }
});

app.post('/api/publish-now', async (req, res) => {
  const { presetId } = req.body;
  const preset = DAILY_TAX_CONTENT.find(p => p.id === presetId) || DAILY_TAX_CONTENT[0];

  const igUserId = process.env.IG_USER_ID || '17841438053748611';
  const igToken = process.env.IG_ACCESS_TOKEN || DEFAULT_IG_TOKEN;
  const pinToken = process.env.PINTEREST_ACCESS_TOKEN || DEFAULT_PIN_TOKEN;

  // High-Resolution PNG Visual Infographic Image URL
  const host = req.get('host') || 'piggymath-social-studio.onrender.com';
  const protocol = req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
  const visualImageUrl = `${protocol}://${host}/api/post-image/${preset.id}.png`;

  console.log(`[API Publish-Now] Publishing HIGH-RES PNG INFOGRAPHIC: ${visualImageUrl}`);

  const igRes = await publishToInstagram({
    igUserId: igUserId,
    accessToken: igToken,
    imageUrl: visualImageUrl,
    caption: preset.igCaption
  });

  const pinRes = await publishToPinterest({
    accessToken: pinToken,
    boardId: process.env.PINTEREST_BOARD_ID || 'PiggyMath Financial Tips',
    imageUrl: visualImageUrl,
    title: preset.pinTitle,
    description: preset.pinDescription
  });

  console.log('[API Publish-Now Results]', { igRes, pinRes });

  res.json({
    success: true,
    message: 'Visual Infographic Post published / dispatched to Instagram & Pinterest!',
    imageUrl: visualImageUrl,
    instagram: igRes,
    pinterest: pinRes
  });
});

// Serve static frontend files from 'dist' directory
app.use(express.static(path.join(__dirname, '../dist')));

// Fallback to index.html for Single Page Application
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`[PiggyMath 24/7 Cloud Server] Running on port ${PORT}`);
  initScheduler();
});
