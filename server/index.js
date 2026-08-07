import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initScheduler } from './scheduler.js';
import { DAILY_TAX_CONTENT } from './contentLibrary.js';
import { publishToInstagram } from './api/instagram.js';
import { publishToPinterest } from './api/pinterest.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Serve static frontend files from 'dist' directory
app.use(express.static(path.join(__dirname, '../dist')));

// API Routes
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
  const igToken = process.env.IG_ACCESS_TOKEN;
  const pinToken = process.env.PINTEREST_ACCESS_TOKEN;

  const igRes = await publishToInstagram({
    igUserId: igUserId,
    accessToken: igToken,
    imageUrl: 'https://piggymath.com/assets/og.png',
    caption: preset.igCaption
  });

  const pinRes = await publishToPinterest({
    accessToken: pinToken,
    boardId: process.env.PINTEREST_BOARD_ID || 'PiggyMath Financial Tips',
    imageUrl: 'https://piggymath.com/assets/og.png',
    title: preset.pinTitle,
    description: preset.pinDescription
  });

  res.json({
    success: true,
    message: 'Post successfully published / dispatched to Instagram & Pinterest!',
    instagram: igRes,
    pinterest: pinRes
  });
});

// Fallback to index.html for Single Page Application
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`[PiggyMath 24/7 Cloud Server] Running on port ${PORT}`);
  initScheduler();
});
