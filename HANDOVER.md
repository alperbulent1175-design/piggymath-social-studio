# PiggyMath Social Content Studio — Developer Handover

**Repository**: `https://github.com/alperbulent1175-design/piggymath-social-studio`
**Live app**: `https://piggymath-social-studio.onrender.com/`
**Website**: `https://piggymath.com/`

---

## What this is

An automated social content generator for [PiggyMath](https://piggymath.com/). It renders 1080×1080 infographic cards server-side from a shared content library and publishes them to Instagram (`@piggymath`) and Pinterest (`PiggyMath`), both on a daily schedule and on demand from the dashboard.

## Current status, honestly stated

A previous version of this document described the system as "100% production ready and fully operational 24/7." That was not accurate, and the discrepancy is worth recording so it isn't repeated.

The daily scheduler read credentials from environment variables that were never set, and the Instagram module returned `{ success: true, simulated: true }` when credentials were missing — so the cron logged healthy results while publishing nothing. The scheduler also attached a static `og.png` rather than the rendered card. The dashboard's "Publish Now" button sent frontend preset ids that the backend could not resolve, so every click published the day-1 self-employment-tax post regardless of which card was selected. The card body itself was hardcoded SE-tax text, so a compound-interest post rendered self-employment-tax bullets. And access tokens were committed to this public repository, one in plain text and one base64-encoded specifically to bypass GitHub Push Protection.

Those issues are fixed. What follows describes the system as it now behaves.

---

## Credentials: environment variables only

**Never commit a token to this repository, in any form.** Base64 is encoding, not encryption: if the server can decode it, so can anyone who clones the repo. Encoding a secret to slip past GitHub Push Protection is worse than being blocked by it, because Push Protection is also what triggers the provider to auto-revoke a leaked token. A secret that reaches a public commit must be treated as compromised even after the file is deleted — it stays readable in history.

All credentials are read in `server/config.js` from the environment. In production they are set in the Render dashboard under Environment; locally, copy `.env.example` to `.env` (git-ignored).

| Variable | Secret | Notes |
| :-- | :-- | :-- |
| `IG_ACCESS_TOKEN` | yes | See token longevity below |
| `IG_USER_ID` | no | `17841438053748611` |
| `FACEBOOK_PAGE_ID` | no | `1160207883850934` |
| `PINTEREST_ACCESS_TOKEN` | yes | |
| `PINTEREST_BOARD_ID` | no | Numeric board id. If unset, the board is matched by `PINTEREST_BOARD_NAME`, then created |
| `PINTEREST_BOARD_NAME` | no | `PiggyMath Tax & Money Tips` |
| `PINTEREST_SANDBOX` | no | `true` routes to the sandbox API, where pins never appear publicly. Leave unset |
| `PUBLIC_BASE_URL` | no | Origin the platforms fetch card images from. Falls back to `RENDER_EXTERNAL_URL` |
| `POST_CRON` / `POST_TIMEZONE` | no | `0 9 * * *`, `America/New_York` |
| `DRY_RUN` | no | `true` renders and logs but never calls the social APIs |

### Token longevity

The 60-day Meta extended token needs manual replacement six times a year and there is no refresh logic in this codebase. Prefer a **Business Manager System User token**, which does not expire: Business Settings → System Users → add a system user, give it Admin on the Instagram Business Account and the Facebook Page, then generate a token with `instagram_basic`, `instagram_content_publish`, `pages_manage_posts`, `pages_read_engagement`.

Pinterest v5 access tokens last 30 days; the refresh token lasts 60 and is refreshable indefinitely, so refreshing before expiry keeps access alive without re-authorising. Automating that refresh is still outstanding — see Known gaps.

---

## Architecture

```
        Vite + React dashboard (src/)
                   |
              REST over HTTP
                   |
        Express server (server/index.js)
                   |
        publisher.js  <-- the ONE publish path
           |          \
   canvasRenderer.js   \
   (resvg SVG -> PNG)   +-- api/instagram.js  (Meta Graph v19.0)
                        +-- api/pinterest.js  (Pinterest v5)
                   ^
                   |
           scheduler.js (node-cron)
```

`publisher.js` exists because the manual route and the cron were previously two separate implementations that drifted apart. Both now call `publishPreset()`. If you add a publishing target, add it there — not in the route handler.

`shared/contentLibrary.js` is the single source of truth for post content, imported by both the React app and the Node server. There used to be two libraries with different preset ids, which is what made the dashboard publish the wrong post. Do not fork it.

### Layout

```
piggymath-social-studio/
├── Dockerfile                  Alpine + fontconfig + DejaVu fonts (Render builds from this)
├── render.yaml                 Render blueprint; secrets are sync:false
├── .env.example                Documented template, no real values
├── shared/
│   └── contentLibrary.js       SINGLE SOURCE OF TRUTH for all post content
├── scripts/
│   └── calibrateFontMetrics.cjs  Regenerates server/fontMetrics.js
├── server/
│   ├── index.js                Express app, API routes, static serving
│   ├── config.js               Env parsing + credential status reporting
│   ├── publisher.js            Shared render-and-publish pipeline
│   ├── scheduler.js            node-cron daily job
│   ├── canvasRenderer.js       Preset -> SVG -> PNG card
│   ├── fontMetrics.js          Measured DejaVu advance widths (generated)
│   └── api/{instagram,pinterest}.js
└── src/                        React dashboard
```

---

## API

| Method | Endpoint | Notes |
| :-- | :-- | :-- |
| `GET` | `/api/health` | Real credential status per platform, scheduler state, last run. Not a hardcoded "connected" |
| `GET` | `/api/presets` | Full library plus today's rotation id |
| `GET` | `/api/preview/:presetId.png` | Renders a card without publishing. Add `?theme=navy\|pink\|light\|mint` |
| `POST` | `/api/publish-now` | Body `{ presetId }`. Publishes that exact preset |
| `GET` | `/assets/card-:presetId.png` | Static card written at publish time, fetched by the platform crawlers |

`/api/publish-now` returns `400` for an unknown preset id (it no longer falls back to preset zero), `503` when no platform is configured, `502` when every platform failed, and `200` on success. The response carries per-platform `{ success, reason }` — the endpoint never reports success on behalf of a platform it did not reach.

---

## Behaviour worth knowing

**Scheduling.** `node-cron` runs in `POST_TIMEZONE`. Without an explicit timezone it uses the process timezone, which is UTC on Render — that is how a job labelled "09:00 EST" came to fire at 05:00 Eastern.

**Rotation.** The daily preset is derived from the day of year (`dayOfYear % library.length`), so it is stateless. The old in-memory counter reset to zero on every restart and deploy, restarting the cycle at post #1.

**Instagram publishing** is a two-step container flow. `api/instagram.js` polls the container's `status_code` until `FINISHED` rather than sleeping a fixed four seconds, then publishes. Meta must be able to fetch the image over the public internet, so `PUBLIC_BASE_URL` cannot be localhost.

**Pinterest publishing** targets the production API. The board is resolved by configured id, then by name, then created — it no longer grabs whichever board the API happens to list first.

**Card rendering** is entirely preset-driven. `bullets` and `highlightBox` from the content library become the card body. Text wraps using measured DejaVu advance widths in `server/fontMetrics.js`; the body font shrinks to fit rather than overflowing the canvas. Emoji are stripped at render time because DejaVu has no colour emoji glyphs and resvg would draw empty boxes — accented characters and punctuation now survive.

---

## Local development

```bash
npm install
cp .env.example .env          # fill in tokens; .env is git-ignored

npm run dev                   # Vite dashboard on :5173
npm run server                # Express API on :4000
npm run build                 # production bundle into dist/
```

To exercise the full pipeline without posting, set `DRY_RUN=true`. To eyeball a card, hit `/api/preview/<presetId>.png`.

Regenerate font metrics after changing the font stack:

```bash
node scripts/calibrateFontMetrics.cjs
```

---

## Known gaps

Pinterest refresh-token rotation is not implemented; the access token still needs manual replacement every 30 days until it is. The dashboard's API Settings tab is a mockup — its inputs save nothing and its "Connected" badges are hardcoded, so read `/api/health` for real status rather than trusting that screen. The "Pause Auto-Posting" toggle is local UI state and does not stop the cron. The content library holds ten presets, so posts repeat every ten days; expanding it is the main content task. If the Render service is on a plan that spins down when idle, an in-process cron cannot fire while the container is asleep — Render's own Cron Job service would be more reliable than `node-cron` here.
