import React, { useRef, useEffect } from 'react';
import { Bell, RotateCcw, Video, Mic, Send, Bot, User, Radio, Sparkles } from 'lucide-react';

export function DoorbellPanel({
  message,
  setMessage,
  onRingBell,
  loading,
  conversation,
  onResetConversation,
  round,
}) {
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loading) {
      onRingBell();
    }
  };

  return (
    <div className="sq-card sq-card-doorbell">
      {/* Editorial Card Top Bar */}
      <div className="sq-card-header">
        <div className="sq-card-title-group">
          <span className="sq-card-number">01</span>
          <div>
            <h2 className="sq-card-title">Front Porch Intercom</h2>
            <p className="sq-card-subtitle">AI Video & Audio Access Control</p>
          </div>
        </div>
        <div className="sq-card-status">
          <span className="sq-rec-dot" />
          <span className="sq-rec-text">LIVE STREAM • 1080P</span>
        </div>
      </div>

      {/* Main Intercom Viewport */}
      <div className="sq-viewport-container">
        {/* Physical 3D Doorbell Unit on the side */}
        <div className="doorbell-hardware-frame">
          <div className="doorbell-hardware-unit">
            <div className="hardware-lens">
              <div className="lens-glass">
                <span className="lens-ir-dot" />
              </div>
            </div>
            <div className="hardware-speaker-grille">
              <span /><span /><span /><span />
            </div>

            {/* Tactile 3D Physical Chime Push Button */}
            <button
              type="button"
              onClick={() => onRingBell()}
              disabled={loading}
              className={`doorbell-chime-3d-btn ${loading ? 'is-ringing' : ''}`}
              title="Press Physical Doorbell Chime"
            >
              <div className="chime-led-ring">
                <Bell size={24} className="chime-bell-icon" />
              </div>
              <span className="chime-label">PUSH CHIME</span>
            </button>
          </div>
        </div>

        {/* Camera Feed & Conversation */}
        <div className="sq-camera-feed">
          <div className="camera-grid-lines" />
          <div className="camera-lens-glare" />
          
          <div className="camera-osd-top">
            <span className="camera-cam-id">CAM_01_FRONT_GATE</span>
            <span className="camera-fps">60 FPS // ENCRYPTED</span>
          </div>

          <div className="camera-chat-area">
            {conversation.length === 0 ? (
              <div className="camera-idle-state">
                <div className="idle-radar-pulse">
                  <Radio size={32} className="text-cyan animate-pulse" />
                </div>
                <h3 className="idle-heading">Motion Guard Standby</h3>
                <p className="idle-desc">
                  Select a test scenario or speak/type below, then press the <strong>3D Chime Button</strong>.
                </p>
              </div>
            ) : (
              <div className="camera-chat-list">
                {conversation.map((item, idx) => (
                  <div
                    key={idx}
                    className={`sq-chat-row ${item.role === 'visitor' ? 'row-visitor' : 'row-guard'}`}
                  >
                    <div className="sq-chat-meta">
                      {item.role === 'visitor' ? (
                        <>
                          <User size={12} />
                          <span>VISITOR</span>
                        </>
                      ) : (
                        <>
                          <Bot size={12} className="text-cyan" />
                          <span className="text-cyan">GUESTVERIFY GUARD</span>
                        </>
                      )}
                    </div>
                    <div className={`sq-chat-bubble ${item.role === 'visitor' ? 'bubble-visitor' : 'bubble-guard'}`}>
                      {item.text || <em className="text-stone-400">(Silent Doorbell Press)</em>}
                    </div>
                  </div>
                ))}
                <div ref={chatBottomRef} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Intercom Input & Actions */}
      <form onSubmit={handleSubmit} className="sq-intercom-form">
        <div className="sq-input-wrapper">
          <Mic size={18} className="sq-mic-icon text-cyan" />
          <input
            type="text"
            className="sq-text-input"
            placeholder={
              round > 0
                ? "State your answer to the follow-up question..."
                : "What does the visitor say? (e.g. 'Delivery for John from Amazon')"
            }
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading}
          />
          {message && (
            <button
              type="button"
              className="sq-clear-btn"
              onClick={() => setMessage('')}
              disabled={loading}
            >
              ×
            </button>
          )}
        </div>

        <div className="sq-form-actions">
          {/* Main 3D Action Button */}
          <button
            type="submit"
            disabled={loading}
            className={`btn-3d btn-3d-primary ${loading ? 'is-loading' : ''}`}
          >
            {loading ? (
              <>
                <span className="btn-3d-spinner" />
                <span>AI EVALUATING...</span>
              </>
            ) : (
              <>
                <Bell size={18} />
                <span>{round > 0 ? 'SUBMIT FOLLOW-UP' : 'RING DOORBELL'}</span>
                <Send size={15} />
              </>
            )}
          </button>

          {conversation.length > 0 && (
            <button
              type="button"
              onClick={onResetConversation}
              disabled={loading}
              className="btn-3d btn-3d-neutral"
              title="Reset intercom session"
            >
              <RotateCcw size={16} />
              <span>RESET</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
