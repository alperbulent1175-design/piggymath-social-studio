import React from 'react';
import { Sparkles, Grid3X3, Calendar, Settings, Download, Send } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, onQuickExport, onQuickPublish }) {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="brand-logo">
          <div className="logo-icon">🐷</div>
          <div className="logo-text">
            <h1>Piggy<span>Math</span></h1>
            <span className="logo-sub">Social Content Studio & Auto-Poster</span>
          </div>
        </div>

        <nav className="main-nav">
          <button
            className={`nav-btn ${activeTab === 'editor' ? 'active' : ''}`}
            onClick={() => setActiveTab('editor')}
          >
            <Sparkles size={18} />
            <span>Post Studio</span>
          </button>

          <button
            className={`nav-btn ${activeTab === 'grid' ? 'active' : ''}`}
            onClick={() => setActiveTab('grid')}
          >
            <Grid3X3 size={18} />
            <span>IG 3x3 Grid Simulator</span>
          </button>

          <button
            className={`nav-btn ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            <Calendar size={18} />
            <span>Auto-Post Queue</span>
          </button>

          <button
            className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={18} />
            <span>API Settings</span>
          </button>
        </nav>

        <div className="header-actions">
          <button className="btn-secondary" onClick={onQuickExport}>
            <Download size={16} />
            <span>Download PNG</span>
          </button>

          <button className="btn-primary" onClick={onQuickPublish}>
            <Send size={16} />
            <span>Publish Now</span>
          </button>
        </div>
      </div>
    </header>
  );
}
