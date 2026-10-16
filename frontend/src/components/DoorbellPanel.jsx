import React, { useRef, useEffect } from 'react';
import { Bell, RotateCcw, Video, Mic, Send, Bot, User } from 'lucide-react';

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
    <div className="doorbell-panel">
      {/* Camera Live Feed Header */}
      <div className="camera-header">
        <div className="camera-title-group">
          <Video size={16} className="text-emerald" />
          <span className="camera-name">CAM 01 // FRONT PORCH INTERCOM</span>
        </div>
        <div className="camera-status-group">
          <span className="rec-badge">
            <span className="rec-dot" /> REC
          </span>
          <span className="fps-badge">60 FPS</span>
        </div>
      </div>

      {/* Camera Viewport & Intercom Chat */}
      <div className="camera-viewport">
        <div className="camera-overlay-grid" />
        <div className="camera-timestamp">
          LIVE • {new Date().toLocaleTimeString()}
        </div>

        {/* Conversation Chat Overlay */}
        <div className="chat-container">
          {conversation.length === 0 ? (
            <div className="chat-empty-state">
              <div className="bell-ring-icon-box">
                <Bell size={28} className="bell-pulse" />
              </div>
              <p className="empty-title">Doorbell Intercom Standby</p>
              <p className="empty-subtitle">
                Type what the visitor says at the door or pick a scenario above, then press "Ring Bell".
              </p>
            </div>
          ) : (
            <div className="chat-messages">
              {conversation.map((item, idx) => (
                <div
                  key={idx}
                  className={`chat-bubble-wrap ${item.role === 'visitor' ? 'align-right' : 'align-left'}`}
                >
                  <div className="bubble-author">
                    {item.role === 'visitor' ? (
                      <>
                        <span>Visitor</span>
                        <User size={12} />
                      </>
                    ) : (
                      <>
                        <Bot size={12} className="text-cyan" />
                        <span className="text-cyan font-mono">GuestVerify Guard</span>
                      </>
                    )}
                  </div>
                  <div
                    className={`chat-bubble ${item.role === 'visitor' ? 'bubble-visitor' : 'bubble-guard'}`}
                  >
                    {item.text || <em className="italic-text">(Silent ring - no speech)</em>}
                  </div>
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>
          )}
        </div>
      </div>

      {/* Visitor Input Control */}
      <form onSubmit={handleSubmit} className="intercom-controls">
        <div className="input-group">
          <div className="input-icon-prefix">
            <Mic size={18} className="text-cyan" />
          </div>
          <input
            type="text"
            className="intercom-input"
            placeholder={
              round > 0
                ? "Answer follow-up question here..."
                : "e.g., 'Delivery for John from Amazon' or state your name..."
            }
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading}
          />
          {message && (
            <button
              type="button"
              className="clear-input-btn"
              onClick={() => setMessage('')}
              disabled={loading}
            >
              ×
            </button>
          )}
        </div>

        <div className="btn-actions-row">
          <button
            type="submit"
            disabled={loading}
            className={`ring-bell-btn ${loading ? 'loading' : ''}`}
          >
            {loading ? (
              <>
                <span className="spinner" />
                <span>Evaluating Audio...</span>
              </>
            ) : (
              <>
                <Bell size={18} />
                <span>{round > 0 ? 'Send Follow-up Answer' : 'Ring Bell'}</span>
                <Send size={14} className="send-icon" />
              </>
            )}
          </button>

          {conversation.length > 0 && (
            <button
              type="button"
              onClick={onResetConversation}
              disabled={loading}
              className="reset-btn"
              title="Reset intercom session"
            >
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
