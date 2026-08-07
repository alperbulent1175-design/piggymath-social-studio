import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
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

// Verified 60-Day Extended Meta Access Token & Active Pinterest Sandbox Token
const VERIFIED_IG_TOKEN = Buffer.from('RUFBTjZyQzdQbEg4QlNJaENETTVES3A2U21URU1Bc3lRRFlYVWVrSXZNT3NPbFJLcExid2ZuZGtJZkZZWkJ4bGQ2aElDME5YblNRNzA3dzlWbU5yZkJzNmEzUTlxVjY3NzhJdk5aQXFjWUp1dXJUa2p1TG5qY1pBYWIwQ3d2eW9aQjZ4Q3pTaWlNUVFpOFpDMjlpWkFBaEFLSEQ1U3ZObjBnc24wVkdVd1hPSmxmZkRoUzVhd2F3cXh1ek50NmFuMWhpYlpCTW5ka05HbDdaQXN5c05j', 'base64').toString('utf-8');

const VERIFIED_PIN_TOKEN = Buffer.from('cGluYV9BTUFYWVpBWUFCSVpPQ0FAG0NBQjZENk9DRUhONUhZQkFDR1NPM01LV1ZONzNMR1NXWExMRzVFNElHWk5MQ1dWMlVWM0VWREFFRUNHQTRGWklTN1BVQks0SkhCNlVWSUE=', 'base64').toString('utf-8');

let livePinterestToken = process.env.PINTEREST_ACCESS_TOKEN || VERIFIED_PIN_TOKEN;

// Ensure static assets directory exists
const assetsDir = path.join(__dirname, '../dist/assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// API Routes FIRST
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'PiggyMath Auto-Post Engine 24/7' });
});

app.get('/api/presets', (req, res) => {
  res.json({ presets: DAILY_TAX_CONTENT });
});

app.post('/api/publish-now', async (req, res) => {
  const { presetId } = req.body;
  const preset = DAILY_TAX_CONTENT.find(p => p.id === presetId) || DAILY_TAX_CONTENT[0];

  const igUserId = process.env.IG_USER_ID || '17841438053748611';
  const igToken = VERIFIED_IG_TOKEN;

  // Generate and save static PNG file to disk for Meta Graph API compliance
  const imageFileName = `card-${preset.id}.png`;
  const imageFilePath = path.join(assetsDir, imageFileName);

  try {
    const pngBuffer = renderPostPng(preset.id);
    fs.writeFileSync(imageFilePath, pngBuffer);
    console.log(`[API Publish-Now] Saved static PNG infographic to ${imageFilePath}`);
  } catch (err) {
    console.error('Error generating static PNG card:', err);
  }

  // Static Visual Infographic Image URL
  const host = req.get('host') || 'piggymath-social-studio.onrender.com';
  const protocol = req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
  const visualImageUrl = `${protocol}://${host}/assets/${imageFileName}`;

  console.log(`[API Publish-Now] Publishing to IG & Pinterest with image: ${visualImageUrl}`);

  const igRes = await publishToInstagram({
    igUserId: igUserId,
    accessToken: igToken,
    imageUrl: visualImageUrl,
    caption: preset.igCaption
  });

  const pinRes = await publishToPinterest({
    accessToken: livePinterestToken,
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

// Serve static frontend files and generated post PNG cards from 'dist' directory
app.use(express.static(path.join(__dirname, '../dist')));

// Fallback to index.html for Single Page Application
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`[PiggyMath 24/7 Cloud Server] Running on port ${PORT}`);
  initScheduler();
});
