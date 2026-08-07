import React from 'react';
import { BRAND_COLORS } from '../data/brandIdentity';
import { Bookmark, Share2, ArrowRight } from 'lucide-react';

export default function CanvasPreview({
  canvasRef,
  format,
  themeKey,
  postData,
  showMascot = true,
  showWatermark = true,
  showCarouselIndicator = false,
  currentSlide = 1,
  totalSlides = 3
}) {
  const theme = BRAND_COLORS[themeKey] || BRAND_COLORS.navy;

  // Determine dynamic canvas aspect ratio style
  const canvasStyle = {
    aspectRatio: format.aspectRatio,
    backgroundColor: theme.bg,
    color: theme.textPrimary
  };

  return (
    <div className="canvas-wrapper">
      <div
        ref={canvasRef}
        id="piggymath-post-canvas"
        className={`post-canvas format-${format.id} theme-${themeKey}`}
        style={canvasStyle}
      >
        {/* Decorative background glow */}
        <div className="canvas-bg-glow" style={{ background: `radial-gradient(circle at 80% 20%, ${theme.accent}15, transparent 60%)` }}></div>

        {/* Top Header Bar */}
        <div className="canvas-header" style={{ borderBottomColor: theme.border }}>
          <div className="canvas-logo">
            <div className="logo-badge" style={{ backgroundColor: theme.accent }}>🐷</div>
            <div className="logo-title">
              <span className="logo-piggy">Piggy</span>
              <span className="logo-math" style={{ color: theme.accent }}>Math</span>
            </div>
          </div>

          <div
            className="category-badge"
            style={{
              backgroundColor: theme.badgeBg,
              borderColor: theme.badgeBorder,
              color: theme.badgeText
            }}
          >
            {postData.badge || 'FINANCIAL TIP'}
          </div>
        </div>

        {/* Hook Banner */}
        {postData.hookTitle && (
          <div className="hook-banner" style={{ backgroundColor: `${theme.accent}1A`, color: theme.accent, borderColor: `${theme.accent}33` }}>
            <span className="hook-icon">💡</span>
            <span className="hook-text">{postData.hookTitle}</span>
          </div>
        )}

        {/* Main Content Area */}
        <div className="canvas-body">
          {/* Main Title */}
          <h2 className="canvas-heading">{postData.mainHeading}</h2>

          {/* Subtitle */}
          {postData.subtitle && (
            <p className="canvas-subtitle" style={{ color: theme.textSecondary }}>
              {postData.subtitle}
            </p>
          )}

          {/* Body Layout 1: Comparison Columns */}
          {postData.comparison ? (
            <div className="comparison-grid">
              <div className="comparison-col col-left" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
                <h4 className="col-header" style={{ color: theme.textPrimary }}>{postData.comparison.col1Title}</h4>
                <ul>
                  {postData.comparison.col1Items.map((item, idx) => (
                    <li key={idx} style={{ color: theme.textSecondary }}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="comparison-col col-right" style={{ backgroundColor: `${theme.accent}0D`, borderColor: theme.accent }}>
                <h4 className="col-header" style={{ color: theme.accent }}>{postData.comparison.col2Title}</h4>
                <ul>
                  {postData.comparison.col2Items.map((item, idx) => (
                    <li key={idx} style={{ color: theme.textPrimary }}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            /* Body Layout 2: Bullet Points List */
            postData.bullets && postData.bullets.length > 0 && (
              <div className="bullet-list-card" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
                {postData.bullets.map((bullet, idx) => (
                  <div key={idx} className="bullet-item" style={{ borderBottomColor: theme.border }}>
                    <span className="bullet-text" style={{ color: theme.textPrimary }}>{bullet}</span>
                  </div>
                ))}
              </div>
            )
          )}

          {/* Highlight Container Box (Formula / IRS Tip) */}
          {postData.highlightBox && (
            <div className="highlight-box" style={{ backgroundColor: theme.cardBg, borderColor: theme.accent }}>
              <div className="highlight-title" style={{ color: theme.accent }}>
                {postData.highlightBox.title}
              </div>
              <div className="highlight-text" style={{ color: theme.textPrimary }}>
                {postData.highlightBox.text}
              </div>
            </div>
          )}
        </div>

        {/* Slide Counter for Carousels */}
        {showCarouselIndicator && (
          <div className="carousel-indicator-badge" style={{ backgroundColor: theme.cardBg, color: theme.textPrimary }}>
            <span>{currentSlide} / {totalSlides}</span>
            <ArrowRight size={12} />
          </div>
        )}

        {/* Footer Bar */}
        <div className="canvas-footer" style={{ borderTopColor: theme.border }}>
          <div className="footer-left">
            {showMascot && <span className="mascot-stamp">🐷</span>}
            <div className="footer-cta-group">
              <span className="cta-main-text" style={{ color: theme.accent }}>
                {postData.ctaText || 'Calculate yours at piggymath.com'}
              </span>
              {showWatermark && (
                <span className="domain-watermark" style={{ color: theme.textSecondary }}>
                  www.piggymath.com
                </span>
              )}
            </div>
          </div>

          <div className="footer-right">
            <div className="social-action-icons" style={{ color: theme.textSecondary }}>
              <Bookmark size={18} />
              <Share2 size={18} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
