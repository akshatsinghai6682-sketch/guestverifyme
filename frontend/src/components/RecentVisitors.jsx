import React from 'react';
import { History, ShieldCheck, HelpCircle, ShieldAlert, Users, ArrowUpRight } from 'lucide-react';

export function RecentVisitors({ logs, onSelectLog }) {
  const total = logs.length;
  const authorized = logs.filter((l) => l.verdict === 'AUTHORIZED').length;
  const suspicious = logs.filter((l) => l.verdict === 'SUSPICIOUS').length;
  const needsInfo = logs.filter((l) => l.verdict === 'NEEDS_MORE_INFO').length;

  return (
    <div className="sq-card sq-card-logs">
      {/* Editorial Card Header */}
      <div className="sq-card-header">
        <div className="sq-card-title-group">
          <span className="sq-card-number">04</span>
          <div>
            <h2 className="sq-card-title">Recent Visitors Audit</h2>
            <p className="sq-card-subtitle">decisions.jsonl Event Journal</p>
          </div>
        </div>
      </div>

      {/* 3D Tactile Metric Tiles */}
      <div className="sq-metrics-grid">
        <div className="metric-tile">
          <span className="metric-label">TOTAL</span>
          <span className="metric-val">{total}</span>
        </div>
        <div className="metric-tile tile-authorized">
          <span className="metric-label">AUTHORIZED</span>
          <span className="metric-val text-emerald">{authorized}</span>
        </div>
        <div className="metric-tile tile-needs-info">
          <span className="metric-label">INQUIRY</span>
          <span className="metric-val text-amber">{needsInfo}</span>
        </div>
        <div className="metric-tile tile-suspicious">
          <span className="metric-label">DENIED</span>
          <span className="metric-val text-red">{suspicious}</span>
        </div>
      </div>

      {/* Visitor Event Stream */}
      <div className="sq-logs-stream">
        {logs.length === 0 ? (
          <div className="sq-empty-logs">
            <p>No recorded visitors yet.</p>
            <span>Events will automatically populate upon intercom activation.</span>
          </div>
        ) : (
          logs.slice(0, 15).map((item, idx) => {
            const isAuth = item.verdict === 'AUTHORIZED';
            const isSusp = item.verdict === 'SUSPICIOUS';

            const badgeClass = isAuth
              ? 'badge-authorized'
              : isSusp
              ? 'badge-suspicious'
              : 'badge-needs-info';

            const timeString = item.timestamp
              ? new Date(item.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })
              : 'Just now';

            return (
              <div
                key={idx}
                className="sq-log-entry"
                onClick={() => onSelectLog && onSelectLog(item)}
              >
                <div className="sq-log-top">
                  <span className={`sq-log-badge ${badgeClass}`}>
                    {item.verdict}
                  </span>
                  <span className="sq-log-time">{timeString}</span>
                </div>
                <p className="sq-log-text">
                  "{item.visitorMessage || item.message || '(Silent Ring)'}"
                </p>
                <div className="sq-log-meta">
                  <span>Confidence: {Math.round((item.confidence || 0) * 100)}%</span>
                  {item.matchedDelivery && (
                    <span className="sq-log-schedule-id">
                      {item.matchedDelivery}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
