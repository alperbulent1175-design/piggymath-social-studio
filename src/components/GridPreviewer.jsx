import React from 'react';
import { CONTENT_PRESETS } from '../data/taxHooksAndTips';
import { BRAND_COLORS } from '../data/brandIdentity';
import { CheckCircle2, Grid3X3, ArrowRight, ShieldCheck } from 'lucide-react';

export default function GridPreviewer({ currentPost, currentThemeKey }) {
  // Build a 9-item grid combining current edit + preset queue
  const gridItems = [
    { ...currentPost, themeKey: currentThemeKey, isCurrent: true },
    { ...CONTENT_PRESETS[1], themeKey: 'pink' },
    { ...CONTENT_PRESETS[2], themeKey: 'light' },
    { ...CONTENT_PRESETS[3], themeKey: 'mint' },
    { ...CONTENT_PRESETS[4], themeKey: 'navy' },
    { ...CONTENT_PRESETS[5], themeKey: 'pink' },
    { ...CONTENT_PRESETS[0], themeKey: 'light' },
    { ...CONTENT_PRESETS[2], themeKey: 'navy' },
    { ...CONTENT_PRESETS[3], themeKey: 'pink' }
  ];

  return (
    <div className="grid-simulator-wrapper">
      <div className="simulator-header-card">
        <div className="header-info">
          <div className="badge-corporate">
            <ShieldCheck size={16} />
            <span>Corporate Brand Aesthetics</span>
          </div>
          <h3>Instagram Profile 3x3 Grid Simulator</h3>
          <p>
            This simulator previews how your upcoming daily automated posts will look on your Instagram profile grid.
            The system automatically alternates brand theme colors (Dark Navy ➔ Clean White ➔ Piggy Pink) to maintain a cohesive, high-converting corporate brand identity.
          </p>
        </div>
      </div>

      {/* Simulated Instagram Profile Header */}
      <div className="simulated-ig-profile">
        <div className="profile-top">
          <div className="profile-avatar">🐷</div>
          <div className="profile-stats">
            <div className="stat"><strong>@piggymath</strong><span>PiggyMath Official</span></div>
            <div className="stat"><strong>365</strong><span>Daily Tips</span></div>
            <div className="stat"><strong>100%</strong><span>Automated</span></div>
          </div>
        </div>
        <div className="profile-bio">
          <strong>PiggyMath — Smart Money Math Made Simple 🐷</strong>
          <p>Free Financial Calculators • Freelancer Tax Tips • Mortgage & Compound Interest</p>
          <a href="https://piggymath.com" target="_blank" rel="noreferrer">piggymath.com</a>
        </div>

        <div className="profile-tabs">
          <button className="tab active"><Grid3X3 size={16} /> POSTS</button>
        </div>

        {/* 3x3 Grid Display */}
        <div className="ig-grid-3x3">
          {gridItems.map((item, index) => {
            const theme = BRAND_COLORS[item.themeKey] || BRAND_COLORS.navy;
            return (
              <div
                key={index}
                className={`grid-cell ${item.isCurrent ? 'current-editing-cell' : ''}`}
                style={{ backgroundColor: theme.bg, color: theme.textPrimary }}
              >
                {item.isCurrent && (
                  <span className="live-editing-badge">
                    <CheckCircle2 size={12} /> Editing Now
                  </span>
                )}
                <div className="cell-content">
                  <span className="cell-cat" style={{ color: theme.accent }}>{item.badge}</span>
                  <p className="cell-title">{item.mainHeading}</p>
                  <span className="cell-domain" style={{ color: theme.textSecondary }}>piggymath.com</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
