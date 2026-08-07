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

// Verified 60-Day Extended Meta Access Token & Dynamic Pinterest Token
const VERIFIED_IG_TOKEN = Buffer.from('RUFBTjZyQzdQbEg4QlNJaENETTVES3A2U21URU1Bc3lRRFlYVWVrSXZNT3NPbFJLcExid2ZuZGtJZkZZWkJ4bGQ2aElDME5YblNRNzA3dzlWbU5yZkJzNmEzUTlxVjY3NzhJdk5aQXFjWUp1dXJUa2p1TG5qY1pBYWIwQ3d2eW9aQjZ4Q3pTaWlNUVFpOFpDMjlpWkFBaEFLSEQ1U3ZObjBnc24wVkdVd1hPSmxmZkRoUzVhd2F3cXh1ek50NmFuMWhpYlpCTW5ka05HbDdaQXN5c05j', 'base64').toString('utf-8');

let livePinterestToken = process.env.PINTEREST_ACCESS_TOKEN || Buffer.from('cGluYV9BTUFYWVpBWUFCSVpPQ0FAG0NBQjZENU9MVFk1WkhZQlFCSVFDNVpFSFg0UEJYTTVRRkJOSkxQSjVHUTNRVzRaT0NTR0RaN1RGS1VRRFFPT1daNkhMVkRLUkZWSkk2UUE=', 'base64').toString('utf-8');

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

// Pinterest OAuth 2.0 Code Callback Endpoint
app.get('/api/pinterest/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).send('Authorization code missing');
  }

  try {
    const appId = '1598588';
    const appSecret = process.env.PINTEREST_APP_SECRET || 'a881cb5a2bfaee9baefd8efdb008aa2e22c954e1';
    const authHeader = Buffer.from(`${appId}:${appSecret}`).toString('base64');
    const redirectUri = `${req.protocol}://${req.get('host')}/api/pinterest/callback`;

    const tokenRes = await fetch('https://api.pinterest.com/v5/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri
      })
    });

    const tokenData = await tokenRes.json();
    if (tokenData.access_token) {
      livePinterestToken = tokenData.access_token;
      console.log('[Pinterest OAuth] Successfully acquired Write Access Token:', livePinterestToken);
      return res.send(`
        <div style="font-family: sans-serif; text-align: center; padding: 50px; background: #0F172A; color: white;">
          <h1 style="color: #FF5271;">🎉 Pinterest Successfully Connected!</h1>
          <p>PiggyMath Social Studio has acquired full write access for Pinterest pins & boards.</p>
          <a href="/" style="display: inline-block; background: #FF5271; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 20px;">Return to Studio</a>
        </div>
      `);
    } else {
      return res.status(400).json({ error: 'Token exchange failed', details: tokenData });
    }
  } catch (err) {
    console.error('Pinterest Callback Error:', err);
    res.status(500).send('Internal Auth Error');
  }
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

  console.log(`[API Publish-Now] Publishing STATIC PNG INFOGRAPHIC to IG @piggymath: ${visualImageUrl}`);

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
