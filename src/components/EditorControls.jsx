import React, { useState } from 'react';
import { BRAND_COLORS } from '../data/brandIdentity';
import { Copy, Check, Palette, Sparkles, Sliders } from 'lucide-react';

export default function EditorControls({
  postData,
  onChangePostData,
  themeKey,
  onChangeThemeKey,
  showMascot,
  onToggleMascot,
  showWatermark,
  onToggleWatermark
}) {
  const [copiedCaption, setCopiedCaption] = useState(false);

  const handleCopyCaption = () => {
    if (postData.igCaption) {
      navigator.clipboard.writeText(postData.igCaption);
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2000);
    }
  };

  return (
    <div className="editor-controls-panel">
      <div className="controls-section">
        <h3 className="section-title">
          <Palette size={18} /> Corporate Theme Palette
        </h3>
        <div className="theme-selector-grid">
          {Object.entries(BRAND_COLORS).map(([key, theme]) => (
            <button
              key={key}
              className={`theme-chip ${themeKey === key ? 'active' : ''}`}
              onClick={() => onChangeThemeKey(key)}
            >
              <span className="theme-color-swatch" style={{ backgroundColor: theme.bg, borderColor: theme.accent }}></span>
              <span className="theme-name">{theme.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="controls-section">
        <h3 className="section-title">
          <Sliders size={18} /> Custom Text & Hook Editor
        </h3>

        <div className="field-group">
          <label>Category Badge:</label>
          <input
            type="text"
            value={postData.badge || ''}
            onChange={(e) => onChangePostData({ ...postData, badge: e.target.value })}
            placeholder="e.g. 1099 TAX TIP"
          />
        </div>

        <div className="field-group">
          <label>Viral Share Hook / Banner:</label>
          <input
            type="text"
            value={postData.hookTitle || ''}
            onChange={(e) => onChangePostData({ ...postData, hookTitle: e.target.value })}
            placeholder="e.g. Send this to a freelancer friend 🚨"
          />
        </div>

        <div className="field-group">
          <label>Main Headline:</label>
          <input
            type="text"
            value={postData.mainHeading || ''}
            onChange={(e) => onChangePostData({ ...postData, mainHeading: e.target.value })}
            placeholder="Main post headline"
          />
        </div>

        <div className="field-group">
          <label>Subtitle / Hook Description:</label>
          <textarea
            rows={2}
            value={postData.subtitle || ''}
            onChange={(e) => onChangePostData({ ...postData, subtitle: e.target.value })}
            placeholder="Supporting subtitle text"
          />
        </div>

        <div className="field-group">
          <label>CTA Button Text:</label>
          <input
            type="text"
            value={postData.ctaText || ''}
            onChange={(e) => onChangePostData({ ...postData, ctaText: e.target.value })}
            placeholder="e.g. Calculate yours at piggymath.com 🐷"
          />
        </div>
      </div>

      <div className="controls-section">
        <h3 className="section-title">
          <Sparkles size={18} /> Brand Elements & Toggles
        </h3>
        <div className="toggle-row">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={showMascot}
              onChange={(e) => onToggleMascot(e.target.checked)}
            />
            <span>Piggy Mascot Stamp (🐷)</span>
          </label>

          <label className="toggle-label">
            <input
              type="checkbox"
              checked={showWatermark}
              onChange={(e) => onToggleWatermark(e.target.checked)}
            />
            <span>Domain Watermark (piggymath.com)</span>
          </label>
        </div>
      </div>

      <div className="controls-section caption-section">
        <div className="caption-header">
          <h3 className="section-title">Instagram & Pinterest Caption</h3>
          <button className="btn-small-copy" onClick={handleCopyCaption}>
            {copiedCaption ? <Check size={14} /> : <Copy size={14} />}
            <span>{copiedCaption ? 'Copied!' : 'Copy Caption'}</span>
          </button>
        </div>
        <textarea
          className="caption-textarea"
          rows={6}
          readOnly
          value={postData.igCaption || ''}
        />
      </div>
    </div>
  );
}
