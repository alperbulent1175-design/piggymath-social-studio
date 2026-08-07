import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import Header from './components/Header';
import FormatSelector from './components/FormatSelector';
import TemplateSelector from './components/TemplateSelector';
import CanvasPreview from './components/CanvasPreview';
import GridPreviewer from './components/GridPreviewer';
import EditorControls from './components/EditorControls';
import CalendarQueue from './components/CalendarQueue';
import ApiSettings from './components/ApiSettings';
import { ASPECT_RATIOS } from './data/brandIdentity';
import { CONTENT_PRESETS } from './data/taxHooksAndTips';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('editor');
  const [selectedFormat, setSelectedFormat] = useState(ASPECT_RATIOS['ig-square']);
  const [selectedPreset, setSelectedPreset] = useState(CONTENT_PRESETS[0]);
  const [postData, setPostData] = useState(CONTENT_PRESETS[0]);
  const [themeKey, setThemeKey] = useState(CONTENT_PRESETS[0].defaultTheme || 'navy');
  const [showMascot, setShowMascot] = useState(true);
  const [showWatermark, setShowWatermark] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  const canvasRef = useRef(null);

  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset);
    setPostData(preset);
    if (preset.defaultTheme) {
      setThemeKey(preset.defaultTheme);
    }
  };

  const handleQuickExport = async () => {
    if (!canvasRef.current) return;
    try {
      const dataUrl = await toPng(canvasRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `piggymath-${postData.badge.toLowerCase().replace(/\s+/g, '-')}-${selectedFormat.id}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export canvas png:', err);
    }
  };

  const handleQuickPublish = () => {
    setPublishing(true);
    setTimeout(() => {
      setPublishing(false);
      setPublishSuccess(true);
      setTimeout(() => setPublishSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="app-layout">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onQuickExport={handleQuickExport}
        onQuickPublish={handleQuickPublish}
      />

      {publishSuccess && (
        <div className="notification-banner success">
          <span>🎉 Post successfully queued & dispatched to Instagram & Pinterest!</span>
        </div>
      )}

      <main className="main-content">
        {activeTab === 'editor' && (
          <div className="editor-tab-layout">
            <aside className="left-sidebar">
              <FormatSelector
                selectedFormat={selectedFormat}
                onSelectFormat={setSelectedFormat}
              />
              <TemplateSelector
                selectedPresetId={selectedPreset.id}
                onSelectPreset={handleSelectPreset}
              />
            </aside>

            <section className="preview-center">
              <CanvasPreview
                canvasRef={canvasRef}
                format={selectedFormat}
                themeKey={themeKey}
                postData={postData}
                showMascot={showMascot}
                showWatermark={showWatermark}
              />
            </section>

            <aside className="right-sidebar">
              <EditorControls
                postData={postData}
                onChangePostData={setPostData}
                themeKey={themeKey}
                onChangeThemeKey={setThemeKey}
                showMascot={showMascot}
                onToggleMascot={setShowMascot}
                showWatermark={showWatermark}
                onToggleWatermark={setShowWatermark}
              />
            </aside>
          </div>
        )}

        {activeTab === 'grid' && (
          <GridPreviewer
            currentPost={postData}
            currentThemeKey={themeKey}
          />
        )}

        {activeTab === 'calendar' && <CalendarQueue />}

        {activeTab === 'settings' && <ApiSettings />}
      </main>
    </div>
  );
}
