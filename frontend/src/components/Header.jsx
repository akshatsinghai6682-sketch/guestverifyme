import React from 'react';
import { ShieldCheck, Volume2, VolumeX, Cpu, Radio } from 'lucide-react';

export function Header({
  aiMode,
  speechEnabled,
  setSpeechEnabled,
  currentTime,
  activeTab = 'intercom',
  onTabClick,
}) {
  const isBedrock = aiMode === 'bedrock';

  return (
    <header className="sq-header">
      <div className="sq-header-inner">
        {/* Brand Logo */}
        <div className="sq-brand">
          <div className="sq-logo-mark">
            <ShieldCheck size={22} className="sq-logo-icon" />
          </div>
          <div className="sq-brand-text">
            <span className="sq-brand-name">GUESTVERIFY</span>
            <span className="sq-brand-badge">PRO GUARD</span>
          </div>
        </div>

        {/* Center Editorial Links - Fully Functional Tabs */}
        <nav className="sq-nav-links">
          <button
            type="button"
            onClick={() => onTabClick && onTabClick('intercom')}
            className={`sq-nav-item ${activeTab === 'intercom' ? 'active' : ''}`}
            title="View Live Doorbell Stream & Camera"
          >
            INTERCOM STREAM
          </button>
          <button
            type="button"
            onClick={() => onTabClick && onTabClick('roster')}
            className={`sq-nav-item ${activeTab === 'roster' ? 'active' : ''}`}
            title="Inspect deliveries.json Ground-Truth Roster"
          >
            SECURITY ROSTER
          </button>
          <button
            type="button"
            onClick={() => onTabClick && onTabClick('audit')}
            className={`sq-nav-item ${activeTab === 'audit' ? 'active' : ''}`}
            title="Jump to decisions.jsonl Audit Log"
          >
            DECISION AUDIT
          </button>
        </nav>

        {/* Right Actions */}
        <div className="sq-header-actions">
          {/* Live IST Clock */}
          <div className="sq-clock-pill">
            <Radio size={13} className="text-cyan pulse-icon" />
            <span>{currentTime || 'IST ACTIVE'}</span>
          </div>

          {/* 3D Speaker Button */}
          <button
            onClick={() => setSpeechEnabled(!speechEnabled)}
            className={`btn-3d btn-3d-secondary ${speechEnabled ? 'is-active' : ''}`}
            title={speechEnabled ? 'Mute Intercom Speaker' : 'Enable Intercom Speaker'}
            type="button"
          >
            {speechEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            <span>{speechEnabled ? 'SPEAKER ON' : 'MUTED'}</span>
          </button>

          {/* 3D Mode Pill */}
          <div className={`btn-3d sq-mode-btn ${isBedrock ? 'btn-3d-purple' : 'btn-3d-emerald'}`}>
            <Cpu size={14} />
            <span>{isBedrock ? 'BEDROCK AI' : 'MOCK AI'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
