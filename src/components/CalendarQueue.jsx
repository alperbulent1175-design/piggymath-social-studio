import React, { useState } from 'react';
import { CONTENT_PRESETS } from '../data/taxHooksAndTips';
import { Calendar, Play, Pause, Send, CheckCircle2, Clock, Instagram, Pin, RefreshCw } from 'lucide-react';

export default function CalendarQueue() {
  const [isAutoActive, setIsAutoActive] = useState(true);
  const [publishingId, setPublishingId] = useState(null);
  const [publishedIds, setPublishedIds] = useState(['se-tax-trap-153']);

  const handleTriggerPublish = (presetId) => {
    setPublishingId(presetId);
    setTimeout(() => {
      setPublishingId(null);
      setPublishedIds((prev) => [...prev, presetId]);
    }, 1500);
  };

  const scheduleDays = [
    { date: 'Today (09:00 AM)', preset: CONTENT_PRESETS[0], platform: 'Both (IG + Pinterest)' },
    { date: 'Tomorrow (09:00 AM)', preset: CONTENT_PRESETS[1], platform: 'Both (IG + Pinterest)' },
    { date: 'Aug 9 (09:00 AM)', preset: CONTENT_PRESETS[2], platform: 'Both (IG + Pinterest)' },
    { date: 'Aug 10 (09:00 AM)', preset: CONTENT_PRESETS[3], platform: 'Both (IG + Pinterest)' },
    { date: 'Aug 11 (09:00 AM)', preset: CONTENT_PRESETS[4], platform: 'Both (IG + Pinterest)' },
    { date: 'Aug 12 (09:00 AM)', preset: CONTENT_PRESETS[5], platform: 'Both (IG + Pinterest)' }
  ];

  return (
    <div className="calendar-queue-container">
      {/* Status Bar */}
      <div className="scheduler-status-card">
        <div className="status-info">
          <div className={`status-indicator ${isAutoActive ? 'online' : 'paused'}`}>
            <span className="dot"></span>
            <strong>{isAutoActive ? 'Automated Daily Poster Active' : 'Daily Poster Paused'}</strong>
          </div>
          <h2>365-Day Daily Auto-Publishing Queue</h2>
          <p>
            The backend engine publishes 1 educational tax post to Instagram & Pinterest every morning at 09:00 AM EST, automatically alternating brand color schemes to maintain your 3x3 grid aesthetic.
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
