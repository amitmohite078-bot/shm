import React, { useState, useEffect } from 'react';
import { DeviceNode } from '../../types';
import { ThreeSystemCore } from '../canvas/ThreeSystemCore';
import { AntigravityCard } from '../ui/AntigravityCard';
import { 
  X, 
  Cpu, 
  Database, 
  HardDrive, 
  Wifi, 
  Thermometer, 
  Terminal, 
  RotateCcw, 
  Zap, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface DeviceDetailModalProps {
  device: DeviceNode;
  onClose: () => void;
}

export const DeviceDetailModal: React.FC<DeviceDetailModalProps> = ({ device, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'logs' | 'hardware'>('overview');
  const [logs, setLogs] = useState<string[]>([]);
  const [diagnosticsRunning, setDiagnosticsRunning] = useState(false);
  const [diagnosticsDone, setDiagnosticsDone] = useState(false);

  // Generate simulated real-time logs for this node
  useEffect(() => {
    const initialLogs = [
      `[${new Date().toISOString().slice(11, 19)}] [KERNEL] Boot sequence verified. ECC memory modules passed.`,
      `[${new Date().toISOString().slice(11, 19)}] [SYSTEM] Ingress mesh connection established to ${device.ip}:443`,
      `[${new Date().toISOString().slice(11, 19)}] [TELEMETRY] Heartbeat broadcast: ${device.lastPingMs}ms ping. Core temp: ${device.temp}°C`,
      `[${new Date().toISOString().slice(11, 19)}] [STORAGE] NVMe array RAID-Z verified. 0 uncorrectable sector read errors.`,
      `[${new Date().toISOString().slice(11, 19)}] [QUANTUM] Decoherence stabilizer synchronized at 0.001 ps drift.`
    ];
    setLogs(initialLogs);

    let msgIdx = 0;
    const interval = setInterval(() => {
      const msgs = [
        `[${new Date().toISOString().slice(11, 19)}] [STREAM] Telemetry frame acknowledged by edge relay.`,
        `[${new Date().toISOString().slice(11, 19)}] [IO] Buffer flush completed in 0.84ms.`,
        `[${new Date().toISOString().slice(11, 19)}] [SECURITY] eBPF filter rule 402 matched and authorized.`,
        `[${new Date().toISOString().slice(11, 19)}] [THERMAL] Fan speed adjusted: 4200 RPM -> optimal gradient.`
      ];
      const nextMsg = msgs[msgIdx % msgs.length];
      msgIdx++;
      setLogs(prev => [...prev.slice(-14), nextMsg]);
    }, 4000);

    return () => clearInterval(interval);
  }, [device]);

  const runDiagnostics = () => {
    setDiagnosticsRunning(true);
    setDiagnosticsDone(false);
    setTimeout(() => {
      setDiagnosticsRunning(false);
      setDiagnosticsDone(true);
      setLogs(prev => [
        ...prev,
        `[${new Date().toISOString().slice(11, 19)}] [DIAGNOSTIC] === FULL HARDWARE TEST COMPLETED ===`,
        `[${new Date().toISOString().slice(11, 19)}] [DIAGNOSTIC] All ${device.cores} Cores @ ${device.frequencyGhz}GHz: OK`,
        `[${new Date().toISOString().slice(11, 19)}] [DIAGNOSTIC] Bus Latency: ${device.lastPingMs}ms (PASSED)`
      ]);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl bg-neutral-950/95 border border-white/20 shadow-[0_25px_80px_rgba(0,0,0,0.98)] p-6 md:p-8 hud-brackets animate-in zoom-in-95 duration-200 relative select-none"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-lg bg-neutral-900 border border-white/15 text-neutral-400 hover:text-white hover:border-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Node Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 pr-12">
          <div>
            <div className="flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full ${device.status === 'online' ? 'bg-white' : 'bg-neutral-400 pulse-warning'}`} />
              <h2 className="text-2xl font-bold font-display text-white tracking-wide">
                {device.name}
              </h2>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-white/10 text-neutral-300 border border-white/20 uppercase">
                {device.type}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs font-mono text-neutral-400 flex-wrap">
              <span>ID: {device.id}</span>
              <span>•</span>
              <span>IP: {device.ip}</span>
              <span>•</span>
              <span>LOCATION: {device.location}</span>
              <span>•</span>
              <span>UPTIME: {device.uptime}</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={runDiagnostics}
              disabled={diagnosticsRunning}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-black font-semibold text-xs font-mono hover:bg-neutral-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)] disabled:opacity-50"
            >
              {diagnosticsRunning ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                  <span>TESTING...</span>
                </>
              ) : diagnosticsDone ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>PASSED</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>DIAGNOSTICS</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 mt-6 pb-2">
          {(['overview', 'logs', 'hardware'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                activeTab === tab 
                  ? 'bg-neutral-800 text-white font-bold border border-white/20' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="mt-6 space-y-6">
            
            {/* Center 3D Node Core + High Level Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* 3D Core */}
              <div className="lg:col-span-5 relative h-[260px] bg-black/80 rounded-xl border border-white/15 p-4 flex items-center justify-center">
                <ThreeSystemCore className="w-full h-full" />
                <div className="absolute bottom-3 left-3 text-[9px] font-mono text-neutral-400">
                  NODE CORE TELEMETRY
                </div>
              </div>

              {/* Metric Matrix */}
              <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
                
                <div className="p-4 rounded-xl bg-neutral-900/70 border border-white/10">
                  <span className="text-[10px] font-mono text-neutral-400 block">CPU USAGE</span>
                  <div className="text-3xl font-bold font-display text-white mt-1">
                    {device.cpu}<span className="text-xs font-mono text-neutral-400">%</span>
                  </div>
                  <span className="text-[9px] font-mono text-neutral-400 mt-2 block">{device.cores} Cores @ {device.frequencyGhz}GHz</span>
                </div>

                <div className="p-4 rounded-xl bg-neutral-900/70 border border-white/10">
                  <span className="text-[10px] font-mono text-neutral-400 block">RAM USAGE</span>
                  <div className="text-3xl font-bold font-display text-white mt-1">
                    {device.ram}<span className="text-xs font-mono text-neutral-400">%</span>
                  </div>
                  <span className="text-[9px] font-mono text-neutral-400 mt-2 block">DDR5 ECC Array</span>
                </div>

                <div className="p-4 rounded-xl bg-neutral-900/70 border border-white/10">
                  <span className="text-[10px] font-mono text-neutral-400 block">STORAGE</span>
                  <div className="text-3xl font-bold font-display text-white mt-1">
                    {device.disk}<span className="text-xs font-mono text-neutral-400">%</span>
                  </div>
                  <span className="text-[9px] font-mono text-neutral-400 mt-2 block">NVMe Gen5 PCIe</span>
                </div>

                <div className="p-4 rounded-xl bg-neutral-900/70 border border-white/10">
                  <span className="text-[10px] font-mono text-neutral-400 block">NETWORK IN</span>
                  <div className="text-2xl font-bold font-display text-white mt-1">
                    {device.networkIn}<span className="text-xs font-mono text-neutral-400"> MB/s</span>
                  </div>
                  <span className="text-[9px] font-mono text-neutral-400 mt-2 block">Fiber Optic Ingress</span>
                </div>

                <div className="p-4 rounded-xl bg-neutral-900/70 border border-white/10">
                  <span className="text-[10px] font-mono text-neutral-400 block">NETWORK OUT</span>
                  <div className="text-2xl font-bold font-display text-white mt-1">
                    {device.networkOut}<span className="text-xs font-mono text-neutral-400"> MB/s</span>
                  </div>
                  <span className="text-[9px] font-mono text-neutral-400 mt-2 block">Egress Mesh</span>
                </div>

                <div className="p-4 rounded-xl bg-neutral-900/70 border border-white/10">
                  <span className="text-[10px] font-mono text-neutral-400 block">THERMAL</span>
                  <div className="text-3xl font-bold font-display text-white mt-1">
                    {device.temp}<span className="text-xs font-mono text-neutral-400">°C</span>
                  </div>
                  <span className="text-[9px] font-mono text-neutral-400 mt-2 block">Cryo-Cooling Optimal</span>
                </div>

              </div>

            </div>

          </div>
        )}

        {activeTab === 'logs' && (
          <div className="mt-6">
            <div className="p-4 rounded-xl bg-black border border-white/15 font-mono text-xs text-neutral-300 space-y-1.5 max-h-[380px] overflow-y-auto">
              <div className="text-neutral-400 pb-2 border-b border-white/10 flex items-center justify-between">
                <span>TERMINAL LOG STREAM // {device.id}</span>
                <span className="inline-block w-2 h-2 rounded-full bg-white animate-ping" />
              </div>
              {logs.map((line, i) => (
                <div key={i} className="leading-relaxed hover:text-white transition-colors">
                  {line}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'hardware' && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/10 space-y-2">
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest block font-bold">
                PROCESSOR SPECIFICATION
              </span>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-neutral-400">Architecture</span>
                <span className="text-white">RISC-X Quantum-Enhanced 2035</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-neutral-400">Physical Cores</span>
                <span className="text-white">{device.cores} Cores</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-neutral-400">Base Clock</span>
                <span className="text-white">{device.frequencyGhz} GHz Turbo</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-400">L3 Cache</span>
                <span className="text-white">512 MB Unified 3D V-Cache</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/10 space-y-2">
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest block font-bold">
                NETWORK INTERFACE MATRIX
              </span>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-neutral-400">Physical Adapter</span>
                <span className="text-white">Dual 800GbE QSFP-DD</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-neutral-400">Hardware Latency</span>
                <span className="text-white">{device.lastPingMs} ms</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-neutral-400">Subnet</span>
                <span className="text-white">255.255.255.0</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-400">Encryption Layer</span>
                <span className="text-white">Post-Quantum Kyber-1024</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
