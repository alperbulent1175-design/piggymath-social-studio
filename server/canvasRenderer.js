// Dynamic Server-Side Visual Post Image Generator for Instagram & Pinterest

import { Resvg } from '@resvg/resvg-js';
import { DAILY_TAX_CONTENT } from './contentLibrary.js';

export function renderPostSvg(presetId, themeKey = 'navy') {
  let preset = DAILY_TAX_CONTENT.find(p => p.id === presetId);

  // Fallback match by category or default
  if (!preset) {
    preset = DAILY_TAX_CONTENT[0];
  }

  const themes = {
    navy: { bg: '#0F172A', cardBg: '#1E293B', textPrimary: '#FFFFFF', textSecondary: '#94A3B8', accent: '#FF5271', badgeBg: 'rgba(255,82,113,0.15)', badgeText: '#FF758F' },
    pink: { bg: '#FFF0F3', cardBg: '#FFFFFF', textPrimary: '#1E293B', textSecondary: '#64748B', accent: '#FF4757', badgeBg: '#FFE4E6', badgeText: '#E11D48' },
    light: { bg: '#F8FAFC', cardBg: '#FFFFFF', textPrimary: '#0F172A', textSecondary: '#475569', accent: '#2563EB', badgeBg: '#EFF6FF', badgeText: '#1D4ED8' },
    mint: { bg: '#ECFDF5', cardBg: '#FFFFFF', textPrimary: '#064E3B', textSecondary: '#047857', accent: '#10B981', badgeBg: '#D1FAE5', badgeText: '#047857' }
  };

  const theme = themes[preset.theme || themeKey] || themes.navy;

  const badgeText = (preset.badge || 'FINANCIAL TIP').replace(/&/g, '&amp;');
  const hookTitle = (preset.hookTitle || 'Smart Money Math Made Simple').replace(/&/g, '&amp;');
  const mainHeading = (preset.mainHeading || 'PiggyMath Tax Tip').replace(/&/g, '&amp;');
  const subtitle = (preset.subtitle || 'Free financial tools at piggymath.com').replace(/&/g, '&amp;');
  const ctaText = (preset.ctaText || 'Calculate free at piggymath.com 🐷').replace(/&/g, '&amp;');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080" style="background-color: ${theme.bg}; font-family: 'DejaVu Sans', 'Liberation Sans', 'Arial', sans-serif;">
    <rect width="1080" height="1080" fill="${theme.bg}"/>

    <!-- Header Section -->
    <g transform="translate(60, 60)">
      <rect width="64" height="64" rx="16" fill="${theme.accent}"/>
      <text x="32" y="44" font-size="36" text-anchor="middle" font-family="'DejaVu Sans', sans-serif">🐷</text>
      
      <text x="84" y="46" font-size="40" font-weight="bold" fill="${theme.textPrimary}" font-family="'DejaVu Sans', sans-serif">Piggy<tspan fill="${theme.accent}">Math</tspan></text>

      <rect x="680" y="8" width="280" height="48" rx="24" fill="${theme.accent}" fill-opacity="0.2" stroke="${theme.accent}" stroke-width="2"/>
      <text x="820" y="40" font-size="18" font-weight="bold" fill="${theme.accent}" text-anchor="middle" font-family="'DejaVu Sans', sans-serif">${badgeText}</text>
    </g>

    <!-- Divider -->
    <line x1="60" y1="150" x2="1020" y2="150" stroke="${theme.accent}" stroke-opacity="0.3" stroke-width="2"/>

    <!-- Hook Banner -->
    <g transform="translate(60, 185)">
      <rect width="960" height="70" rx="14" fill="${theme.accent}" fill-opacity="0.15" stroke="${theme.accent}" stroke-opacity="0.4" stroke-width="2"/>
      <text x="30" y="44" font-size="24" font-weight="bold" fill="${theme.accent}" font-family="'DejaVu Sans', sans-serif">💡 ${hookTitle}</text>
    </g>

    <!-- Main Title -->
    <g transform="translate(60, 310)">
      <text x="0" y="35" font-size="42" font-weight="bold" fill="${theme.textPrimary}" font-family="'DejaVu Sans', sans-serif">${mainHeading}</text>
      <text x="0" y="85" font-size="24" fill="${theme.textSecondary}" font-family="'DejaVu Sans', sans-serif">${subtitle}</text>
    </g>

    <!-- Main Content Card (Bullet Points) -->
    <g transform="translate(60, 440)">
      <rect width="960" height="360" rx="20" fill="${theme.cardBg}" stroke="${theme.accent}" stroke-opacity="0.3" stroke-width="2"/>
      
      <!-- Bullet 1 -->
      <text x="40" y="70" font-size="26" font-weight="bold" fill="${theme.textPrimary}" font-family="'DejaVu Sans', sans-serif">• 📊 Social Security Tax: 12.4% (Up to income cap)</text>
      <line x1="40" y1="100" x2="920" y2="100" stroke="${theme.textSecondary}" stroke-opacity="0.2" stroke-width="1"/>

      <!-- Bullet 2 -->
      <text x="40" y="150" font-size="26" font-weight="bold" fill="${theme.textPrimary}" font-family="'DejaVu Sans', sans-serif">• 🏥 Medicare Tax: 2.9% (Unlimited income)</text>
      <line x1="40" y1="180" x2="920" y2="180" stroke="${theme.textSecondary}" stroke-opacity="0.2" stroke-width="1"/>

      <!-- Bullet 3 -->
      <text x="40" y="230" font-size="26" font-weight="bold" fill="${theme.accent}" font-family="'DejaVu Sans', sans-serif">• 💡 Total SE Tax = 15.3% ON TOP of regular income tax!</text>

      <!-- Highlight Formula Box -->
      <rect x="40" y="270" width="880" height="60" rx="10" fill="${theme.accent}" fill-opacity="0.2"/>
      <text x="60" y="308" font-size="22" font-weight="bold" fill="${theme.accent}" font-family="'DejaVu Sans', sans-serif">Formula: Gross 1099 Income x 92.35% x 15.3% = Your SE Tax</text>
    </g>

    <!-- Footer Bar -->
    <g transform="translate(60, 960)">
      <line x1="0" y1="0" x2="960" y2="0" stroke="${theme.textSecondary}" stroke-opacity="0.2" stroke-width="2"/>
      
      <text x="0" y="45" font-size="32" font-family="'DejaVu Sans', sans-serif">🐷</text>
      <text x="50" y="42" font-size="24" font-weight="bold" fill="${theme.accent}" font-family="'DejaVu Sans', sans-serif">${ctaText}</text>
      <text x="50" y="68" font-size="18" fill="${theme.textSecondary}" font-family="'DejaVu Sans', sans-serif">www.piggymath.com</text>

      <!-- Save & Share Badge -->
      <rect x="780" y="20" width="180" height="48" rx="24" fill="${theme.cardBg}" stroke="${theme.textSecondary}" stroke-opacity="0.3" stroke-width="2"/>
      <text x="870" y="50" font-size="20" font-weight="bold" fill="${theme.textPrimary}" text-anchor="middle" font-family="'DejaVu Sans', sans-serif">📌 Save &amp; Share</text>
    </g>
  </svg>`;

  return svg;
}

export function renderPostPng(presetId, themeKey = 'navy') {
  const svg = renderPostSvg(presetId, themeKey);
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1080 },
    font: {
      loadSystemFonts: true,
      defaultFontFamily: 'DejaVu Sans'
    }
  });
  const pngData = resvg.render();
  return pngData.asPng();
}
