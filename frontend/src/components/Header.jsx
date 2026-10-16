import React from 'react';
import { ShieldCheck, Volume2, VolumeX, Cpu, Radio } from 'lucide-react';

export function Header({ aiMode, speechEnabled, setSpeechEnabled, currentTime }) {
  const isBedrock = aiMode === 'bedrock';

  return (
    <header className="header-container">
      <div className="header-brand">
        <div className="brand-icon-wrapper">
          <ShieldCheck className="brand-icon" />
          <span className="live-dot" />
        </div>
        <div>
          <div className="brand-title-row">
            <h1 className="brand-title">GuestVerify</h1>
            <span className="brand-version">v2.0 Guard</span>
          </div>
          <p className="brand-subtitle">AI Security Guard for Smart Intercom & Doorbell</p>
        </div>
      </div>

      <div className="header-actions">
        {/* Live Clock */}
        <div className="clock-badge">
          <Radio size={14} className="pulse-icon text-cyan" />
          <span>{currentTime || 'IST 18:00+'}</span>
        </div>

        {/* Spoken Audio Toggle */}
        <button
          onClick={() => setSpeechEnabled(!speechEnabled)}
          className={`icon-toggle-btn ${speechEnabled ? 'active' : ''}`}
          title={speechEnabled ? 'Mute Doorbell Speaker' : 'Enable Doorbell Speaker'}
          type="button"
        >
          {speechEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          <span className="toggle-text">{speechEnabled ? 'Speaker ON' : 'Speaker MUTED'}</span>
        </button>

        {/* AI Operating Mode Badge */}
        <div className={`mode-badge ${isBedrock ? 'mode-bedrock' : 'mode-mock'}`}>
          <Cpu size={14} />
          <span>{isBedrock ? 'Bedrock AI (Claude)' : 'Mock AI (Rule Engine)'}</span>
        </div>
      </div>
    </header>
  );
}
