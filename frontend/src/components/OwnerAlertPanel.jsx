import React from 'react';
import { BellRing, ShieldAlert, X, Smartphone, Check } from 'lucide-react';

export function OwnerAlertPanel({ alerts, onDismissAlert, onClearAll }) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="owner-alert-panel clean-state">
        <div className="panel-header">
          <div className="header-left">
            <Smartphone size={16} className="text-cyan" />
            <h4 className="panel-heading">Simulated Owner Notifications</h4>
          </div>
          <span className="clean-badge">System Secure</span>
        </div>
        <p className="clean-subtext">No security alerts triggered. Standing by for suspicious activity.</p>
      </div>
    );
  }

  return (
    <div className="owner-alert-panel has-alerts">
      <div className="panel-header">
        <div className="header-left">
          <BellRing size={16} className="text-red alert-bell-shake" />
          <h4 className="panel-heading text-red">Owner Phone Alert Feed ({alerts.length})</h4>
        </div>
        <button onClick={onClearAll} className="clear-alerts-btn" type="button">
          Dismiss All
        </button>
      </div>

      <div className="alerts-list">
        {alerts.map((alert) => (
          <div key={alert.id} className="alert-item">
            <div className="alert-top">
              <div className="alert-title-wrap">
                <ShieldAlert size={16} className="text-red" />
                <span className="alert-title">SECURITY EVENT: Access Denied</span>
              </div>
              <span className="alert-time">{alert.time}</span>
            </div>
            <p className="alert-msg">"{alert.visitorMessage || 'Unrecognized visitor'}"</p>
            <p className="alert-reason">{alert.reasoning}</p>
            <div className="alert-footer">
              <span className="alert-action">SMS & App Push Simulated</span>
              <button
                onClick={() => onDismissAlert(alert.id)}
                className="dismiss-single-btn"
                title="Dismiss notification"
              >
                <Check size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
