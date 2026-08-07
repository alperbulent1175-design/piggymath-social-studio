import cron from 'node-cron';
import { config, credentialStatus } from './config.js';
import { publishPreset, presetForDate } from './publisher.js';

let lastRun = null;

export function getSchedulerState() {
  return {
    cron: config.postCron,
    timezone: config.postTimezone,
    nextPreset: presetForDate().id,
    lastRun
  };
}

export function initScheduler() {
  if (!cron.validate(config.postCron)) {
    console.error(`[Scheduler] Invalid POST_CRON "${config.postCron}". Scheduler NOT started.`);
    return;
  }

  const status = credentialStatus();
  if (!status.anyReady && !config.dryRun) {
    // Start anyway so the failure is visible in the logs at post time rather
    // than the job quietly not existing, but say so loudly now.
    console.error('[Scheduler] Starting with NO platform configured. Daily runs will fail until IG_ACCESS_TOKEN / PINTEREST_ACCESS_TOKEN are set.');
  }

  cron.schedule(config.postCron, async () => {
    const preset = presetForDate();
    console.log(`[Scheduler] Firing for ${preset.id} — "${preset.mainHeading}"`);
    try {
      const result = await publishPreset(preset, { source: 'cron' });
      lastRun = {
        at: new Date().toISOString(),
        presetId: preset.id,
        instagram: result.instagram,
        pinterest: result.pinterest,
        published: result.instagram.success || result.pinterest.success
      };
      if (!lastRun.published) {
        console.error('[Scheduler] Daily post did NOT publish on any platform.', JSON.stringify(lastRun));
      }
    } catch (err) {
      console.error('[Scheduler] Run threw:', err);
      lastRun = { at: new Date().toISOString(), presetId: preset.id, published: false, error: err.message };
    }
  }, {
    // Without this, node-cron uses the process timezone. Render containers run
    // UTC, so "0 9 * * *" fired at 09:00 UTC — 05:00 in New York — while the
    // UI advertised 09:00 EST.
    timezone: config.postTimezone
  });

  console.log(`[Scheduler] Daily post scheduled: "${config.postCron}" in ${config.postTimezone}. Today's preset: ${presetForDate().id}`);
}
