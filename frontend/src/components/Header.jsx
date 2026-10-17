import React from 'react';
import { ShieldCheck, Volume2, VolumeX, Cpu, Radio, ChevronDown } from 'lucide-react';

export function Header({
  aiMode,
  speechEnabled,
  setSpeechEnabled,
  currentTime,
  activeTab = 'intercom',
  onTabClick,
  onRingBell,
}) {
  const isBedrock = aiMode === 'bedrock';

  return (
    <header className="sq-header">
      <div className="sq-header-inner">
        {/* Brand Logo */}
        <div className="sq-brand">
          <div className="sq-logo-mark">
            <ShieldCheck size={20} className="sq-logo-icon" />
          </div>
          <div className="sq-brand-text">
            <span className="sq-brand-name">GUESTVERIFY</span>
            <span className="sq-brand-badge">PRO GUARD</span>
          </div>
        </div>

        {/* Center Dropdown Navigation Links */}
        <nav className="sq-nav-links">
          <button
            type="button"
            onClick={() => onTabClick && onTabClick('intercom')}
            className={`sq-nav-item ${activeTab === 'intercom' ? 'active' : ''}`}
            title="View Live Doorbell Stream & Camera"
          >
            <span>INTERCOM</span>
            <ChevronDown size={13} className="nav-chevron" />
          </button>
          <button
            type="button"
            onClick={() => onTabClick && onTabClick('roster')}
            className={`sq-nav-item ${activeTab === 'roster' ? 'active' : ''}`}
            title="Inspect deliveries.json Ground-Truth Roster"
          >
            <span>SECURITY ROSTER</span>
            <ChevronDown size={13} className="nav-chevron" />
          </button>
          <button
            type="button"
            onClick={() => onTabClick && onTabClick('audit')}
            className={`sq-nav-item ${activeTab === 'audit' ? 'active' : ''}`}
            title="Jump to decisions.jsonl Audit Log"
          >
            <span>DECISION AUDIT</span>
            <ChevronDown size={13} className="nav-chevron" />
          </button>
        </nav>

        {/* Right Actions: Clock, Speaker, Mode, Log In, GET STARTED */}
        <div className="sq-header-actions">
          {/* Live IST Clock */}
          <div className="sq-clock-pill">
            <Radio size={12} className="text-cyan pulse-icon" />
            <span>{currentTime || 'IST ACTIVE'}</span>
          </div>

          {/* Speaker Button */}
          <button
            onClick={() => setSpeechEnabled(!speechEnabled)}
            className={`sq-speaker-btn ${speechEnabled ? 'is-active' : ''}`}
            title={speechEnabled ? 'Mute Intercom Speaker' : 'Enable Intercom Speaker'}
            type="button"
          >
            {speechEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>

          {/* Mode Pill */}
          <div className={`sq-mode-pill ${isBedrock ? 'is-bedrock' : 'is-mock'}`}>
            <Cpu size={12} />
            <span>{isBedrock ? 'BEDROCK' : 'MOCK AI'}</span>
          </div>

          {/* Log In Link */}
          <button
            type="button"
            onClick={() => onTabClick && onTabClick('roster')}
            className="sq-login-btn"
          >
            LOG IN
          </button>

          {/* Squarespace-style GET STARTED White Button */}
          <button
            type="button"
            onClick={() => {
              if (onRingBell) {
                onRingBell();
              } else {
                document.getElementById('intercom-section')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="sq-get-started-btn"
          >
            GET STARTED
          </button>
        </div>
      </div>
    </header>
  );
}
