import React from 'react';
import { History, ShieldCheck, HelpCircle, ShieldAlert, Users } from 'lucide-react';

export function RecentVisitors({ logs, onSelectLog }) {
  const total = logs.length;
  const authorized = logs.filter((l) => l.verdict === 'AUTHORIZED').length;
  const suspicious = logs.filter((l) => l.verdict === 'SUSPICIOUS').length;
  const needsInfo = logs.filter((l) => l.verdict === 'NEEDS_MORE_INFO').length;

  return (
    <div className="recent-visitors-panel">
      {/* Stats row */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">
            <Users size={13} className="text-muted" />
            <span>Total</span>
          </div>
          <div className="stat-val">{total}</div>
        </div>

        <div className="stat-card stat-authorized">
          <div className="stat-label">
            <ShieldCheck size={13} className="text-emerald" />
            <span>Authorized</span>
          </div>
          <div className="stat-val text-emerald">{authorized}</div>
        </div>

        <div className="stat-card stat-needs-info">
          <div className="stat-label">
            <HelpCircle size={13} className="text-amber" />
            <span>Needs Info</span>
          </div>
          <div className="stat-val text-amber">{needsInfo}</div>
        </div>

        <div className="stat-card stat-suspicious">
          <div className="stat-label">
            <ShieldAlert size={13} className="text-red" />
            <span>Suspicious</span>
          </div>
          <div className="stat-val text-red">{suspicious}</div>
        </div>
      </div>

      {/* Recent Visitors Log Header */}
      <div className="panel-title-row">
        <History size={16} className="text-cyan" />
        <h3 className="panel-title">Recent Visitors Log</h3>
      </div>

      {logs.length === 0 ? (
        <div className="empty-logs">
          <p>No visitor history yet.</p>
          <p className="empty-subtext">Events will appear here as visitors ring the doorbell.</p>
        </div>
      ) : (
        <div className="logs-feed">
          {logs.slice(0, 15).map((item, idx) => {
            const isAuth = item.verdict === 'AUTHORIZED';
            const isSusp = item.verdict === 'SUSPICIOUS';

            const badgeClass = isAuth
              ? 'badge-authorized'
              : isSusp
              ? 'badge-suspicious'
              : 'badge-needs-info';

            const timeString = item.timestamp
              ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
              : 'Just now';

            return (
              <div
                key={idx}
                className="log-item"
                onClick={() => onSelectLog && onSelectLog(item)}
              >
                <div className="log-top">
                  <span className={`log-verdict-badge ${badgeClass}`}>
                    {item.verdict}
                  </span>
                  <span className="log-time">{timeString}</span>
                </div>
                <p className="log-msg">
                  "{item.visitorMessage || item.message || '(Empty message)'}"
                </p>
                <div className="log-bottom">
                  <span className="log-confidence">
                    Score: {Math.round((item.confidence || 0) * 100)}%
                  </span>
                  {item.matchedDelivery && (
                    <span className="log-delivery">{item.matchedDelivery}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
