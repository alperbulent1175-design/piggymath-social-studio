import React, { useState } from 'react';
import { CONTENT_PRESETS } from '../data/taxHooksAndTips';
import { Calendar, Play, Pause, Send, CheckCircle2, Clock, Instagram, Pin, RefreshCw } from 'lucide-react';

export default function CalendarQueue() {
  const [isAutoActive, setIsAutoActive] = useState(true);
  const [publishingId, setPublishingId] = useState(null);
  const [publishedIds, setPublishedIds] = useState([]);

  const handleTriggerPublish = async (presetId) => {
    setPublishingId(presetId);
    try {
      const res = await fetch('/api/publish-now', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ presetId: presetId })
      });
      const data = await res.json();
      console.log('Calendar publish triggered:', data);
      if (data.success) {
        setPublishedIds((prev) => [...prev, presetId]);
      }
    } catch (err) {
      console.error('Error triggering publish:', err);
    } finally {
      setPublishingId(null);
    }
  };

  // Mirrors presetForDate() in server/publisher.js. These rows used to be a
  // hardcoded list of CONTENT_PRESETS[0..5] with fixed August dates, so the
  // queue showed posts the backend was never going to send.
  const dayOfYear = (d) =>
    Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(d.getFullYear(), 0, 0)) / 86400000);

  const scheduleDays = Array.from({ length: 7 }, (_, offset) => {
    const day = new Date();
    day.setDate(day.getDate() + offset);
    const label =
      offset === 0 ? 'Today' : offset === 1 ? 'Tomorrow' : day.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    return {
      key: day.toISOString().slice(0, 10),
      date: `${label} (09:00 AM ET)`,
      preset: CONTENT_PRESETS[dayOfYear(day) % CONTENT_PRESETS.length]
    };
  });

  return (
    <div className="calendar-queue-container">
      {/* Status Bar */}
      <div className="scheduler-status-card">
        <div className="status-info">
          <div className={`status-indicator ${isAutoActive ? 'online' : 'paused'}`}>
            <span className="dot"></span>
            <strong>{isAutoActive ? 'Automated Daily Poster Active' : 'Daily Poster Paused'}</strong>
          </div>
          <h2>Daily Auto-Publishing Queue</h2>
          <p>
            The backend publishes one post to Instagram &amp; Pinterest each morning at 09:00 America/New_York, rotating through the {CONTENT_PRESETS.length} presets in the shared content library by day of year.
          </p>
        </div>

        <div className="status-actions">
          <button
            className={`btn-toggle-auto ${isAutoActive ? 'active' : ''}`}
            onClick={() => setIsAutoActive(!isAutoActive)}
          >
            {isAutoActive ? <Pause size={16} /> : <Play size={16} />}
            <span>{isAutoActive ? 'Pause Auto-Posting' : 'Resume Auto-Posting'}</span>
          </button>
        </div>
      </div>

      {/* Queue List */}
      <div className="queue-list-section">
        <h3 className="section-title">
          <Calendar size={18} /> Scheduled Upcoming Posts
        </h3>

        <div className="queue-cards-list">
          {scheduleDays.map((item, index) => {
            const isPublished = publishedIds.includes(item.preset.id);
            const isPublishing = publishingId === item.preset.id;

            return (
              <div key={index} className={`queue-item-card ${isPublished ? 'published' : ''}`}>
                <div className="time-col">
                  <Clock size={16} className="clock-icon" />
                  <span>{item.date}</span>
                </div>

                <div className="content-col">
                  <div className="badge-row">
                    <span className="cat-badge">{item.preset.badge}</span>
                    <div className="platform-badges">
                      <span className="platform-pill ig"><Instagram size={12} /> Instagram</span>
                      <span className="platform-pill pin"><Pin size={12} /> Pinterest</span>
                    </div>
                  </div>
                  <h4 className="item-title">{item.preset.mainHeading}</h4>
                  <p className="item-hook">💡 {item.preset.hookTitle}</p>
                </div>

                <div className="action-col">
                  {isPublished ? (
                    <span className="published-tag">
                      <CheckCircle2 size={16} /> Auto-Published
                    </span>
                  ) : (
                    <button
                      className="btn-publish-now"
                      disabled={isPublishing}
                      onClick={() => handleTriggerPublish(item.preset.id)}
                    >
                      {isPublishing ? (
                        <>
                          <RefreshCw size={14} className="spin-icon" /> Publishing...
                        </>
                      ) : (
                        <>
                          <Send size={14} /> Publish Now
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
