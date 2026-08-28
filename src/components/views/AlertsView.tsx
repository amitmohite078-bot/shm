import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext';
import { AntigravityCard } from '../ui/AntigravityCard';
import { AlertSeverity } from '../../types';
import { 
  ShieldAlert, 
  Check, 
  Trash2, 
  Plus, 
  Filter, 
  Terminal, 
  Zap, 
  RotateCcw,
  CheckCheck
} from 'lucide-react';

export const AlertsView: React.FC = () => {
  const { 
    alerts, 
    acknowledgeAlert, 
    dismissAlert, 
    triggerSimulatedAlert 
  } = useSystem();

  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const filteredAlerts = alerts.filter(a => 
    severityFilter === 'all' || a.severity === severityFilter
  );

  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 select-none">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
              HIGH-CONTRAST MONOCHROME TICKER
            </span>
          </div>
          <h1 className="text-3xl font-bold font-display text-white tracking-wide mt-0.5">
            INCIDENT & ANOMALY HUB
          </h1>
          <p className="text-xs font-mono text-neutral-400 mt-1">
            Pure monochrome threat classification. {unacknowledgedCount} unacknowledged anomalies requiring operator triage.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => triggerSimulatedAlert('critical')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/20 text-xs font-mono text-white transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>TEST CRITICAL</span>
          </button>

          <button
            onClick={() => triggerSimulatedAlert('warning')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/20 text-xs font-mono text-neutral-300 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>TEST WARNING</span>
          </button>
        </div>
      </div>

      {/* Severity Filter Bar */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4">
        {(['all', 'critical', 'warning', 'info'] as const).map(sev => (
          <button
            key={sev}
            onClick={() => setSeverityFilter(sev)}
            className={`px-3.5 py-1 rounded-md text-xs font-mono uppercase tracking-wider transition-all ${
              severityFilter === sev 
                ? 'bg-white text-black font-bold' 
                : 'bg-neutral-950 text-neutral-400 hover:text-white border border-white/10'
            }`}
          >
            {sev} ({sev === 'all' ? alerts.length : alerts.filter(a => a.severity === sev).length})
          </button>
        ))}
      </div>

      {/* Alert Feed List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="py-20 text-center rounded-2xl bg-neutral-950 border border-white/10">
            <ShieldAlert className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
            <div className="text-sm font-mono text-neutral-300 font-bold">
              NO ACTIVE ANOMALIES IN BUFFER
            </div>
            <p className="text-xs font-mono text-neutral-400 mt-1">
              All quantum telemetry layers and node metrics are operating within expected thresholds.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCrit = alert.severity === 'critical';
            const isWarn = alert.severity === 'warning';

            return (
              <AntigravityCard
                key={alert.id}
                floatDelay="none"
                depthZ={isCrit ? 16 : 8}
                className={`transition-all ${
                  isCrit 
                    ? 'border-white bg-neutral-950' 
                    : isWarn 
                    ? 'border-white/30 bg-neutral-950' 
                    : 'border-white/10 bg-neutral-950/60'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Alert Details */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        isCrit ? 'bg-white pulse-critical' : isWarn ? 'bg-neutral-300 pulse-warning' : 'bg-neutral-400'
                      }`} />
                      
                      <span className={`text-[10px] font-mono font-bold tracking-widest px-2 py-0.5 rounded uppercase ${
                        isCrit ? 'bg-white text-black font-extrabold' : isWarn ? 'bg-neutral-800 text-white border border-white/20' : 'bg-neutral-900 text-neutral-400'
                      }`}>
                        {isCrit ? '! CRITICAL ANOMALY' : alert.severity.toUpperCase()}
                      </span>

                      <span className="text-xs font-mono text-neutral-400">
                        {alert.id}
                      </span>
                      <span className="text-xs font-mono text-neutral-400">
                        • {alert.timestamp}
                      </span>
                    </div>

                    <h3 className="text-base font-bold font-display text-white">
                      {alert.title}
                    </h3>

                    <p className="text-xs font-mono text-neutral-300 max-w-3xl">
                      {alert.message}
                    </p>

                    <div className="flex items-center gap-4 text-[10px] font-mono text-neutral-400 pt-1">
                      <span>NODE: {alert.device}</span>
                      {alert.metric && (
                        <>
                          <span>•</span>
                          <span>METRIC: {alert.metric}</span>
                          <span>•</span>
                          <span>VALUE: <strong className="text-white">{alert.value}</strong></span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Operator Action Buttons */}
                  <div className="flex items-center gap-2">
                    {!alert.acknowledged ? (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-black font-semibold text-xs font-mono hover:bg-neutral-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>ACKNOWLEDGE</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-white/10 text-xs font-mono text-neutral-400">
                        <CheckCheck className="w-3.5 h-3.5 text-white" />
                        <span>ACKNOWLEDGED</span>
                      </div>
                    )}

                    <button
                      onClick={() => dismissAlert(alert.id)}
                      className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-white/10 transition-colors"
                      title="Dismiss Incident"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </AntigravityCard>
            );
          })
        )}
      </div>

    </div>
  );
};
