import React from 'react';
import { BellRing, ShieldAlert, Smartphone, Check, ShieldCheck } from 'lucide-react';

export function OwnerAlertPanel({ alerts, onDismissAlert, onClearAll }) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="sq-card sq-card-alerts is-clean">
        <div className="sq-card-header">
          <div className="sq-card-title-group">
            <span className="sq-card-number">03</span>
            <div>
              <h2 className="sq-card-title">Owner Push Feed</h2>
              <p className="sq-card-subtitle">Real-time Emergency Dispatch</p>
            </div>
          </div>
          <span className="sq-status-pill pill-secure">
            <ShieldCheck size={12} /> SECURE
          </span>
        </div>
        <p className="sq-clean-message">No suspicious incidents detected. Perimeters secure.</p>
      </div>
    );
  }

  return (
    <div className="sq-card sq-card-alerts has-alarm">
      <div className="sq-card-header">
        <div className="sq-card-title-group">
          <span className="sq-card-number">03</span>
          <div>
            <h2 className="sq-card-title text-red">Owner Push Feed ({alerts.length})</h2>
            <p className="sq-card-subtitle">Simulated SMS & Smartphone Dispatches</p>
          </div>
        </div>
        <button
          onClick={onClearAll}
          className="btn-3d btn-3d-neutral btn-sm"
          type="button"
        >
          DISMISS ALL
        </button>
      </div>

      <div className="sq-alerts-stream">
        {alerts.map((alert) => (
          <div key={alert.id} className="sq-alert-card">
            <div className="sq-alert-card-top">
              <div className="sq-alert-title-wrap">
                <ShieldAlert size={16} className="text-red" />
                <span className="sq-alert-label">ACCESS DENIED</span>
              </div>
              <span className="sq-alert-timestamp">{alert.time}</span>
            </div>
            <p className="sq-alert-quote">"{alert.visitorMessage || 'Unrecognized visitor'}"</p>
            <p className="sq-alert-reason">{alert.reasoning}</p>
            <div className="sq-alert-card-bottom">
              <span className="sq-alert-badge-sms">Mobile Push Simulated</span>
              <button
                onClick={() => onDismissAlert(alert.id)}
                className="btn-3d btn-3d-neutral btn-xs"
                title="Acknowledge alert"
              >
                <Check size={12} />
                <span>ACK</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
