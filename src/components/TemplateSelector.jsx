import React from 'react';
import { CONTENT_PRESETS } from '../data/taxHooksAndTips';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function TemplateSelector({ selectedPresetId, onSelectPreset }) {
  return (
    <div className="template-selector">
      <div className="selector-header">
        <label className="section-label">
          <Sparkles size={16} className="inline-icon" />
          Educational Tax Presets & Viral Hooks:
        </label>
        <span className="preset-count">{CONTENT_PRESETS.length} Shareable Presets</span>
      </div>

      <div className="preset-list">
        {CONTENT_PRESETS.map((preset) => (
          <div
            key={preset.id}
            className={`preset-card ${selectedPresetId === preset.id ? 'active' : ''}`}
            onClick={() => onSelectPreset(preset)}
          >
            <div className="preset-badge">{preset.badge}</div>
            <h4 className="preset-hook">{preset.hookTitle}</h4>
            <p className="preset-title">{preset.mainHeading}</p>
            <div className="preset-footer">
              <span className="category-tag">{preset.category}</span>
              <span className="apply-link">
                Load Preset <ArrowRight size={12} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
