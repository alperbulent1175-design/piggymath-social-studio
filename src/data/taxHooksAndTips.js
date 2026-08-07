// Re-export of the canonical library so existing frontend imports keep working.
// The presets themselves live in shared/contentLibrary.js and are shared with
// the publishing backend — the two lists must never diverge again.
export { CONTENT_PRESETS } from '../../shared/contentLibrary.js';
