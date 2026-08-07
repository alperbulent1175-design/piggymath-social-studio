import cron from 'node-cron';
import { DAILY_TAX_CONTENT } from './contentLibrary.js';
import { publishToInstagram } from './api/instagram.js';
import { publishToPinterest } from './api/pinterest.js';

let currentDayIndex = 0;

export function initScheduler() {
  console.log('[PiggyMath Scheduler] Daily auto-posting cron job initialized (09:00 AM EST).');

  // Schedule daily post at 09:00 AM every day ('0 9 * * *')
  cron.schedule('0 9 * * *', async () => {
    const postItem = DAILY_TAX_CONTENT[currentDayIndex % DAILY_TAX_CONTENT.length];
    console.log(`[Cron Auto-Poster] Publishing daily post #${currentDayIndex + 1}: "${postItem.mainHeading}"`);

    const igResult = await publishToInstagram({
      igUserId: process.env.IG_USER_ID,
      accessToken: process.env.IG_ACCESS_TOKEN,
      imageUrl: `https://piggymath.com/assets/og.png`,
      caption: postItem.igCaption
    });

    const pinResult = await publishToPinterest({
      accessToken: process.env.PINTEREST_ACCESS_TOKEN,
      boardId: process.env.PINTEREST_BOARD_ID,
      imageUrl: `https://piggymath.com/assets/og.png`,
      title: postItem.pinTitle,
      description: postItem.pinDescription
    });

    console.log('[Cron Auto-Poster Results]', { igResult, pinResult });
    currentDayIndex++;
  });
}
