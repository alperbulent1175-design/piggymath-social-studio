// Server-side infographic card renderer (SVG -> PNG via resvg).
//
// The card BODY is driven entirely by the preset (`bullets`, `highlightBox`).
// It used to be hardcoded self-employment-tax text, which meant every post —
// compound interest, mileage, budgeting — rendered the same SE tax bullets.
// If you add a field here, add it to shared/contentLibrary.js, not to this file.

import { Resvg } from '@resvg/resvg-js';
import { CONTENT_PRESETS } from '../shared/contentLibrary.js';
import { wrapText, measureText, fitFontSize } from './fontMetrics.js';

const CANVAS = 1080;
const MARGIN = 60;
const CONTENT_W = CANVAS - MARGIN * 2; // 960
const FOOTER_Y = 960;

const THEMES = {
  navy: { bg: '#0F172A', cardBg: '#1E293B', textPrimary: '#FFFFFF', textSecondary: '#94A3B8', accent: '#FF5271', badgeText: '#FF758F' },
  pink: { bg: '#FFF0F3', cardBg: '#FFFFFF', textPrimary: '#1E293B', textSecondary: '#64748B', accent: '#FF4757', badgeText: '#E11D48' },
  light: { bg: '#F8FAFC', cardBg: '#FFFFFF', textPrimary: '#0F172A', textSecondary: '#475569', accent: '#2563EB', badgeText: '#1D4ED8' },
  mint: { bg: '#ECFDF5', cardBg: '#FFFFFF', textPrimary: '#064E3B', textSecondary: '#047857', accent: '#10B981', badgeText: '#047857' }
};

const FONT = "'DejaVu Sans', 'Liberation Sans', sans-serif";

/**
 * resvg renders with DejaVu Sans, which has no colour emoji glyphs — emoji came
 * out as empty boxes, which is why the old code stripped everything above
 * 0x7F. That also removed accented letters, curly quotes and em dashes. Strip
 * the pictographic ranges only, and transliterate the punctuation we can.
 */
function sanitize(input) {
  if (input === undefined || input === null) return '';
  return String(input)
    .replace(/[\u{1F000}-\u{1FAFF}\u{2190}-\u{2BFF}\u{FE00}-\u{FE0F}\u{2600}-\u{27BF}\u{20E3}]/gu, '')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Full XML escaping. The previous version escaped `&` only; a `<` in any
 *  preset produced malformed SVG and a hard render failure. */
function esc(input) {
  return sanitize(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Wrap after sanitizing, so measurement sees exactly what will be drawn. */
function wrap(text, maxWidth, fontSize, bold = false) {
  return wrapText(sanitize(text), maxWidth, fontSize, bold);
}

function textBlock(lines, x, y, lineHeight, attrs) {
  return lines
    .map((l, i) => `<text x="${x}" y="${y + i * lineHeight}" ${attrs}>${esc(l)}</text>`)
    .join('\n      ');
}

export function resolvePreset(presetIdOrObject) {
  if (presetIdOrObject && typeof presetIdOrObject === 'object') return presetIdOrObject;
  return CONTENT_PRESETS.find(p => p.id === presetIdOrObject) || CONTENT_PRESETS[0];
}

export function renderPostSvg(presetIdOrObject, themeKey) {
  const preset = resolvePreset(presetIdOrObject);
  const theme = THEMES[themeKey || preset.defaultTheme] || THEMES.navy;

  const badgeText = sanitize(preset.badge) || 'FINANCIAL TIP';
  const badgeFont = fitFontSize(badgeText, 300, 18, 12, true);
  const badge = esc(badgeText);
  const bullets = Array.isArray(preset.bullets) && preset.bullets.length
    ? preset.bullets.map(sanitize).filter(Boolean)
    : [];
  const highlight = preset.highlightBox || null;

  // ---- Flowing vertical layout -------------------------------------------
  let y = 190;

  const hookLines = wrap(preset.hookTitle, CONTENT_W - 60, 24, true);
  const hookH = 24 + hookLines.length * 32;
  const hookTop = y;
  y += hookH + 44;

  const headingLines = wrap(preset.mainHeading, CONTENT_W, 42, true);
  const headingTop = y + 38;
  y += headingLines.length * 52 + 14;

  const subtitleLines = wrap(preset.subtitle, CONTENT_W, 24);
  const subtitleTop = y + 20;
  y += subtitleLines.length * 32 + 34;

  const cardTop = y;
  const cardAvailable = FOOTER_Y - 40 - cardTop;

  // Shrink the body until it fits rather than letting it spill over the footer.
  let bulletFont = 26;
  let layout;
  for (;;) {
    const lineH = bulletFont + 8;
    const wrapped = bullets.map(b => wrap(b, CONTENT_W - 100, bulletFont, true));
    const bulletsH = wrapped.reduce((sum, lines) => sum + lines.length * lineH + 34, 0);

    const hlFont = Math.max(18, bulletFont - 4);
    const hlLines = highlight ? wrap(highlight.text, CONTENT_W - 140, hlFont, true) : [];
    const hlTitleH = highlight && highlight.title ? hlFont + 12 : 0;
    const hlH = highlight ? hlTitleH + hlLines.length * (hlFont + 8) + 34 : 0;

    const needed = 40 + bulletsH + (highlight ? hlH + 12 : 0) + 20;
    if (needed <= cardAvailable || bulletFont <= 18) {
      layout = { lineH, wrapped, bulletsH, hlFont, hlLines, hlTitleH, hlH, cardH: Math.min(Math.max(needed, 200), cardAvailable) };
      break;
    }
    bulletFont -= 2;
  }

  // ---- Body markup --------------------------------------------------------
  let bodyY = cardTop + 46;
  const bulletMarkup = layout.wrapped.map((lines, i) => {
    const isLast = i === layout.wrapped.length - 1;
    const colour = isLast && layout.wrapped.length > 1 ? theme.accent : theme.textPrimary;
    const block = lines
      .map((l, j) => `<text x="${MARGIN + 40}" y="${bodyY + j * layout.lineH}" font-size="${bulletFont}" font-weight="bold" fill="${colour}" font-family="${FONT}">${j === 0 ? '• ' : '   '}${esc(l)}</text>`)
      .join('\n      ');
    bodyY += lines.length * layout.lineH;
    const rule = isLast ? '' : `\n      <line x1="${MARGIN + 40}" y1="${bodyY + 4}" x2="${CANVAS - MARGIN - 40}" y2="${bodyY + 4}" stroke="${theme.textSecondary}" stroke-opacity="0.2" stroke-width="1"/>`;
    bodyY += 34;
    return block + rule;
  }).join('\n      ');

  let highlightMarkup = '';
  if (highlight) {
    const boxTop = bodyY - 6;
    const boxH = layout.hlH;
    let ty = boxTop + layout.hlFont + 18;
    let inner = '';
    if (highlight.title) {
      inner += `<text x="${MARGIN + 60}" y="${ty}" font-size="${layout.hlFont - 2}" font-weight="bold" fill="${theme.badgeText}" font-family="${FONT}">${esc(highlight.title)}</text>`;
      ty += layout.hlFont + 10;
    }
    inner += '\n      ' + textBlock(layout.hlLines, MARGIN + 60, ty, layout.hlFont + 8,
      `font-size="${layout.hlFont}" font-weight="bold" fill="${theme.accent}" font-family="${FONT}"`);
    highlightMarkup = `
      <rect x="${MARGIN + 40}" y="${boxTop}" width="${CONTENT_W - 80}" height="${boxH}" rx="12" fill="${theme.accent}" fill-opacity="0.16"/>
      ${inner}`;
  }

  // The footer has one line of room between the logo mark and the Save & Share
  // pill. Shrink the CTA to fit rather than truncating it — the old code kept
  // only the first wrapped line, which cut "piggymath.com" off the end.
  const ctaText = sanitize(preset.ctaText) || 'Free calculators at piggymath.com';
  const ctaMaxWidth = 700;
  const ctaFont = fitFontSize(ctaText, ctaMaxWidth, 24, 15, true);
  const ctaFits = measureText(ctaText, ctaFont, true) <= ctaMaxWidth;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS}" height="${CANVAS}" viewBox="0 0 ${CANVAS} ${CANVAS}">
  <rect width="${CANVAS}" height="${CANVAS}" fill="${theme.bg}"/>

  <!-- Header -->
  <g transform="translate(${MARGIN}, ${MARGIN})">
    <rect width="64" height="64" rx="16" fill="${theme.accent}"/>
    <path d="M22 30C22 23.37 27.37 18 34 18H38C44.63 18 50 23.37 50 30V38C50 44.63 44.63 50 38 50H34C27.37 50 22 44.63 22 38V30Z" fill="white"/>
    <circle cx="30" cy="28" r="3" fill="${theme.accent}"/>
    <circle cx="42" cy="28" r="3" fill="${theme.accent}"/>
    <rect x="30" y="36" width="12" height="6" rx="3" fill="${theme.accent}"/>
    <text x="84" y="46" font-size="40" font-weight="bold" fill="${theme.textPrimary}" font-family="${FONT}">Piggy<tspan fill="${theme.accent}">Math</tspan></text>
    <rect x="620" y="8" width="340" height="48" rx="24" fill="${theme.accent}" fill-opacity="0.18" stroke="${theme.accent}" stroke-width="2"/>
    <text x="790" y="40" font-size="${badgeFont}" font-weight="bold" fill="${theme.badgeText}" text-anchor="middle" font-family="${FONT}">${badge}</text>
  </g>

  <line x1="${MARGIN}" y1="150" x2="${CANVAS - MARGIN}" y2="150" stroke="${theme.accent}" stroke-opacity="0.3" stroke-width="2"/>

  <!-- Hook -->
  <rect x="${MARGIN}" y="${hookTop}" width="${CONTENT_W}" height="${hookH}" rx="14" fill="${theme.accent}" fill-opacity="0.14" stroke="${theme.accent}" stroke-opacity="0.4" stroke-width="2"/>
  ${textBlock(hookLines, MARGIN + 30, hookTop + 42, 32, `font-size="24" font-weight="bold" fill="${theme.accent}" font-family="${FONT}"`)}

  <!-- Heading -->
  ${textBlock(headingLines, MARGIN, headingTop, 52, `font-size="42" font-weight="bold" fill="${theme.textPrimary}" font-family="${FONT}"`)}
  ${textBlock(subtitleLines, MARGIN, subtitleTop, 32, `font-size="24" fill="${theme.textSecondary}" font-family="${FONT}"`)}

  <!-- Body -->
  <rect x="${MARGIN}" y="${cardTop}" width="${CONTENT_W}" height="${layout.cardH}" rx="20" fill="${theme.cardBg}" stroke="${theme.accent}" stroke-opacity="0.3" stroke-width="2"/>
      ${bulletMarkup}${highlightMarkup}

  <!-- Footer -->
  <g transform="translate(${MARGIN}, ${FOOTER_Y})">
    <line x1="0" y1="0" x2="${CONTENT_W}" y2="0" stroke="${theme.textSecondary}" stroke-opacity="0.2" stroke-width="2"/>
    <rect width="36" height="36" rx="8" fill="${theme.accent}"/>
    <text x="18" y="25" font-size="20" font-weight="bold" fill="white" text-anchor="middle" font-family="${FONT}">P</text>
    <text x="50" y="26" font-size="${ctaFont}" font-weight="bold" fill="${theme.accent}" font-family="${FONT}">${esc(ctaFits ? ctaText : 'Free calculators at piggymath.com')}</text>
    <text x="50" y="52" font-size="18" fill="${theme.textSecondary}" font-family="${FONT}">www.piggymath.com</text>
    <rect x="760" y="10" width="200" height="48" rx="24" fill="${theme.cardBg}" stroke="${theme.textSecondary}" stroke-opacity="0.3" stroke-width="2"/>
    <text x="860" y="40" font-size="18" font-weight="bold" fill="${theme.textPrimary}" text-anchor="middle" font-family="${FONT}">Save &amp; Share</text>
  </g>
</svg>`;
}

export function renderPostPng(presetIdOrObject, themeKey) {
  const svg = renderPostSvg(presetIdOrObject, themeKey);
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: CANVAS },
    font: { loadSystemFonts: true, defaultFontFamily: 'DejaVu Sans' }
  });
  return resvg.render().asPng();
}
