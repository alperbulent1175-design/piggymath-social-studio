import React from 'react';
import { ASPECT_RATIOS } from '../data/brandIdentity';
import { Square, RectangleVertical, Smartphone, Pin } from 'lucide-react';

export default function FormatSelector({ selectedFormat, onSelectFormat }) {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Square': return <Square size={16} />;
      case 'RectangleVertical': return <RectangleVertical size={16} />;
      case 'Smartphone': return <Smartphone size={16} />;
      case 'Pin': return <Pin size={16} />;
      default: return <Square size={16} />;
    }
  };

  return (
    <div className="format-selector">
      <label className="section-label">Canvas Ratio & Social Format:</label>
      <div className="format-grid">
        {Object.values(ASPECT_RATIOS).map((format) => (
          <button
            key={format.id}
            className={`format-card ${selectedFormat.id === format.id ? 'selected' : ''}`}
            onClick={() => onSelectFormat(format)}
          >
            <div className="format-icon">{getIcon(format.icon)}</div>
            <div className="format-info">
              <span className="format-name">{format.name}</span>
              <span className="format-dim">{format.width}x{format.height}px</span>
            </div>
            <span className="platform-tag">{format.platform}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
