import React from 'react';
import { useSystem } from '../../context/SystemContext';
import { AntigravityCard } from './AntigravityCard';
import { ShieldCheck, Cpu, HardDrive, Wifi, Lock, CheckCircle2, X } from 'lucide-react';

export const TelemetryPermissionModal: React.FC = () => {
  const { 
    showPermissionModal, 
    grantPermission, 
    denyPermission, 
    hasTelemetryPermission 
  } = useSystem();

  if (!showPermissionModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in select-none">
      <div className="w-full max-w-lg">
        <AntigravityCard floatDelay="none" depthZ={25} className="p-6 border-neutral-800 bg-black text-white shadow-[0_25px_80px_rgba(0,0,0,0.8)] hud-brackets">
          
          {/* Header Icon */}
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-950 border border-[#00E5FF]/40 flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.2)]">
                <ShieldCheck className="w-5 h-5 text-[#00E5FF]" />
              </div>
              <div>
                <span className="text-[9px] font-mono tracking-widest text-[#00E5FF] uppercase font-bold block">
                  SECURITY CLEARANCE // PROTOCOL 2035
                </span>
                <h2 className="text-lg font-bold font-display text-white tracking-wide">
                  GRANT REAL HARDWARE ACCESS
                </h2>
              </div>
            </div>

            {hasTelemetryPermission !== null && (
              <button 
                onClick={denyPermission}
                className="p-1 rounded text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Explanation text */}
          <p className="text-xs font-mono text-neutral-300 leading-relaxed mb-4">
            NEXORA requires explicit operator authorization to query and stream <strong className="text-white">real physical hardware telemetry</strong> from your host machine instead of simulated demo data.
          </p>

          {/* Hardware probes list */}
          <div className="space-y-2 mb-5">
            <div className="flex items-start gap-3 p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
              <Cpu className="w-4 h-4 text-[#00E5FF] mt-0.5" />
              <div className="text-[11px] font-mono">
                <span className="text-white font-semibold block">Real CPU Cores & Concurrency</span>
                <span className="text-neutral-400 text-[10px]">
                  Queries physical core count ({navigator.hardwareConcurrency || 8} Logical Cores detected)
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
              <HardDrive className="w-4 h-4 text-[#00E5FF] mt-0.5" />
              <div className="text-[11px] font-mono">
                <span className="text-white font-semibold block">Real Heap & Device RAM Telemetry</span>
                <span className="text-neutral-400 text-[10px]">
                  Captures real JavaScript heap allocation and Java OS memory metrics
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
              <Wifi className="w-4 h-4 text-[#00E5FF] mt-0.5" />
              <div className="text-[11px] font-mono">
                <span className="text-white font-semibold block">Real Network Downlink & RTT Ping</span>
                <span className="text-neutral-400 text-[10px]">
                  Measures live round-trip latency and active network bandwidth throughput
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-neutral-800">
            <button
              onClick={grantPermission}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-lg bg-[#00E5FF] text-black font-bold font-mono text-xs tracking-wider uppercase hover:bg-white transition-all shadow-[0_0_20px_rgba(0,229,255,0.35)] flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>GRANT ACCESS (REAL DATA)</span>
            </button>

            <button
              onClick={denyPermission}
              className="w-full sm:w-auto py-2.5 px-4 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-mono text-neutral-400 hover:text-white transition-all"
            >
              CANCEL
            </button>
          </div>

          <div className="text-center mt-3">
            <span className="text-[9px] font-mono text-neutral-400">
              You can revoke or modify hardware permissions anytime from the top bar.
            </span>
          </div>

        </AntigravityCard>
      </div>
    </div>
  );
};
