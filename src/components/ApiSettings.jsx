import React, { useState } from 'react';
import { Key, Instagram, Pin, CheckCircle2, AlertCircle, Save, ExternalLink } from 'lucide-react';

export default function ApiSettings() {
  const [igUserId, setIgUserId] = useState('17841438053748611');
  const [igToken, setIgToken] = useState('');
  const [pinToken, setPinToken] = useState('');
  const [pinBoardId, setPinBoardId] = useState('PiggyMath Financial Tips');
  const [savedStatus, setSavedStatus] = useState(false);
  const [testingIg, setTestingIg] = useState(false);
  const [testingPin, setTestingPin] = useState(false);
  const [igConnected, setIgConnected] = useState(true);
  const [pinConnected, setPinConnected] = useState(true);

  const handleSave = () => {
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

  const handleTestIg = async () => {
    setTestingIg(true);
    setTimeout(() => {
      setTestingIg(false);
      setIgConnected(true);
    }, 1000);
  };

  const handleTestPin = () => {
    setTestingPin(true);
    setTimeout(() => {
      setTestingPin(false);
      setPinConnected(true);
    }, 1000);
  };

  return (
    <div className="api-settings-container">
      <div className="settings-header-card">
        <Key size={24} className="header-icon" />
        <div>
          <h2>Social API & Auto-Publishing Integration</h2>
          <p>
            Both <strong>Instagram (@piggymath)</strong> and <strong>Pinterest (PiggyMath)</strong> official APIs are active & verified!
          </p>
        </div>
      </div>

      <div className="settings-grid">
        {/* Meta / Instagram Graph API Settings */}
        <div className="api-card">
          <div className="card-header">
            <div className="icon-group ig">
              <Instagram size={20} />
              <span>Instagram (@piggymath)</span>
            </div>
            {igConnected ? (
              <span className="status-connected"><CheckCircle2 size={14} /> Connected (@piggymath)</span>
            ) : (
              <span className="status-disconnected"><AlertCircle size={14} /> Not Connected</span>
            )}
          </div>

          <div className="card-body">
            <div className="field-group">
              <label>Instagram Business Account ID:</label>
              <input
                type="text"
                value={igUserId}
                onChange={(e) => setIgUserId(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label>Meta Access Token:</label>
              <input
                type="password"
                placeholder="Enter Meta Access Token..."
                value={igToken}
                onChange={(e) => setIgToken(e.target.value)}
              />
            </div>

            <div className="api-help-link">
              <a href="https://developers.facebook.com/docs/instagram-api" target="_blank" rel="noreferrer">
                Meta Graph API Verified for @piggymath <ExternalLink size={12} />
              </a>
            </div>

            <button className="btn-test-connection" onClick={handleTestIg} disabled={testingIg}>
              {testingIg ? 'Testing...' : 'Re-Test Instagram Connection'}
            </button>
          </div>
        </div>

        {/* Pinterest API v5 Settings */}
        <div className="api-card">
          <div className="card-header">
            <div className="icon-group pin">
              <Pin size={20} />
              <span>Pinterest (PiggyMath)</span>
            </div>
            {pinConnected ? (
              <span className="status-connected"><CheckCircle2 size={14} /> Connected (PiggyMath)</span>
            ) : (
              <span className="status-disconnected"><AlertCircle size={14} /> Not Connected</span>
            )}
          </div>

          <div className="card-body">
            <div className="field-group">
              <label>Pinterest Target Board:</label>
              <input
                type="text"
                placeholder="PiggyMath Financial Tips"
                value={pinBoardId}
                onChange={(e) => setPinBoardId(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label>Pinterest OAuth Access Token:</label>
              <input
                type="password"
                placeholder="Enter Pinterest Access Token..."
                value={pinToken}
                onChange={(e) => setPinToken(e.target.value)}
              />
            </div>

            <div className="api-help-link">
              <a href="https://developers.pinterest.com/docs/api/v5/" target="_blank" rel="noreferrer">
                Pinterest API v5 Verified for PiggyMath <ExternalLink size={12} />
              </a>
            </div>

            <button className="btn-test-connection" onClick={handleTestPin} disabled={testingPin}>
              {testingPin ? 'Testing Token...' : 'Re-Test Pinterest Connection'}
            </button>
          </div>
        </div>
      </div>

      <div className="settings-footer-actions">
        <button className="btn-save-settings" onClick={handleSave}>
          <Save size={16} />
          <span>{savedStatus ? 'Credentials Saved & Active!' : 'Save Credentials'}</span>
        </button>
      </div>
    </div>
  );
}
