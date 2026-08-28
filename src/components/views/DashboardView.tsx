import React from 'react';
import { useSystem } from '../../context/SystemContext';
import { AntigravityCard } from '../ui/AntigravityCard';
import { ThreeSystemCore } from '../canvas/ThreeSystemCore';
import { ThreeHealthRing } from '../canvas/ThreeHealthRing';
import { MonochromeChart } from '../ui/MonochromeChart';
import { 
  Cpu, 
  Database, 
  HardDrive, 
  Wifi, 
  ArrowUpRight, 
  Server,
  ShieldAlert
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    currentMetrics, 
    metricHistory, 
    alerts, 
    setView, 
    setSelectedDevice,
    devices,
    networkStrength
  } = useSystem();

  const unackAlerts = alerts.filter(a => !a.acknowledged);

  return (
    <div className="space-y-3.5 animate-in fade-in duration-200 w-full">
      
      {/* Top Banner Alert Strip */}
      {unackAlerts.length > 0 && (
        <div className="relative overflow-hidden rounded-xl bg-black text-white border border-neutral-800 p-3 shadow-md hud-brackets">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#00E5FF] pulse-blue-dot" />
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#00E5FF] px-2 py-0.5 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/30">
                  {unackAlerts[0].severity.toUpperCase()} INCIDENT
                </span>
                <span className="text-xs font-mono text-neutral-200">
                  {unackAlerts[0].title} — {unackAlerts[0].device}
                </span>
              </div>
            </div>
            <button
              onClick={() => setView('alerts')}
              className="inline-flex items-center gap-1 text-xs font-mono text-black font-semibold hover:bg-[#00E5FF] bg-white px-2.5 py-1 rounded transition-all"
            >
              <span>TRIAGE ({unackAlerts.length})</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Main Spatial Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start w-full">
        
        {/* Left Column */}
        <div className="lg:col-span-3 space-y-3.5">
          
          {/* CPU Card */}
          <AntigravityCard floatDelay="slow" depthZ={14} className="group">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_6px_#00E5FF]" />
                  <span className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase">
                    COMPUTE // CPU LOAD
                  </span>
                </div>
                <div className="mt-0.5 flex items-baseline gap-1">
                  <span className="text-3xl font-bold font-display text-white tracking-tight">
                    {currentMetrics.cpu}
                  </span>
                  <span className="text-xs font-mono text-[#00E5FF]">%</span>
                </div>
              </div>
              <div className="p-1.5 rounded bg-neutral-900 border border-neutral-800 text-[#00E5FF] group-hover:border-[#00E5FF] transition-all">
                <Cpu className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-2">
              <MonochromeChart data={metricHistory} dataKey="cpu" height={50} showLabels={false} />
            </div>

            <div className="mt-2 pt-2 border-t border-neutral-800 flex items-center justify-between text-[9px] font-mono text-neutral-400">
              <span>64 CORES</span>
              <span className="text-white">4.8 GHz</span>
            </div>
          </AntigravityCard>

          {/* RAM Card */}
          <AntigravityCard floatDelay="mid" depthZ={12} className="group">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_6px_#00E5FF]" />
                  <span className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase">
                    MEMORY // ALLOCATION
                  </span>
                </div>
                <div className="mt-0.5 flex items-baseline gap-1">
                  <span className="text-3xl font-bold font-display text-white tracking-tight">
                    {currentMetrics.ram}
                  </span>
                  <span className="text-xs font-mono text-[#00E5FF]">%</span>
                </div>
              </div>
              <div className="p-1.5 rounded bg-neutral-900 border border-neutral-800 text-[#00E5FF] group-hover:border-[#00E5FF] transition-all">
                <Database className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-2">
              <MonochromeChart data={metricHistory} dataKey="ram" height={50} showLabels={false} />
            </div>

            <div className="mt-2 pt-2 border-t border-neutral-800 flex items-center justify-between text-[9px] font-mono text-neutral-400">
              <span>87.4 GB / 128 GB</span>
              <span className="text-white">FRAG: 3.2%</span>
            </div>
          </AntigravityCard>

        </div>

        {/* Center 3D Core Viewport */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <AntigravityCard floatDelay="none" depthZ={20} className="w-full relative overflow-hidden bg-black border-neutral-800 p-4 min-h-[380px] flex flex-col justify-between">
            
            {/* Top HUD */}
            <div className="flex items-center justify-between z-10 w-full">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00E5FF] pulse-blue-dot" />
                <span className="text-[10px] font-mono tracking-widest text-white uppercase font-bold">
                  NEXORA // 3D QUANTUM CORE
                </span>
              </div>
              <span className="text-[9px] font-mono text-[#00E5FF] border border-[#00E5FF]/30 px-2 py-0.5 rounded bg-[#00E5FF]/10 font-semibold">
                SYNCHRONIZED
              </span>
            </div>

            {/* 3D Core WebGL */}
            <div className="relative w-full h-[260px] my-auto flex items-center justify-center">
              <ThreeSystemCore className="w-full h-full" />
              
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
                <div className="w-40 h-40 border border-dashed border-[#00E5FF]/50 rounded-full" />
                <div className="absolute w-60 h-60 border border-neutral-800 rounded-full" />
              </div>
            </div>

            {/* Bottom HUD */}
            <div className="z-10 w-full pt-2 border-t border-neutral-800 grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
              <div>
                <span className="text-[8px] text-neutral-400 block uppercase">STABILITY</span>
                <span className="font-bold text-white">99.98%</span>
              </div>
              <div>
                <span className="text-[8px] text-neutral-400 block uppercase">VELOCITY</span>
                <span className="font-bold text-[#00E5FF]">
                  {(1.0 + (currentMetrics.cpu / 100)).toFixed(2)}x
                </span>
              </div>
              <div>
                <span className="text-[8px] text-neutral-400 block uppercase">CRYO TEMP</span>
                <span className="font-bold text-white">{currentMetrics.thermalC}°C</span>
              </div>
            </div>
          </AntigravityCard>

          {/* Health Ring */}
          <div className="w-full mt-3.5">
            <AntigravityCard floatDelay="mid" depthZ={16} className="w-full">
              <ThreeHealthRing className="w-full min-h-[170px]" />
            </AntigravityCard>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-3 space-y-3.5">
          
          {/* Storage NVMe */}
          <AntigravityCard floatDelay="fast" depthZ={14} className="group">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_6px_#00E5FF]" />
                  <span className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase">
                    STORAGE // NVMe
                  </span>
                </div>
                <div className="mt-0.5 flex items-baseline gap-1">
                  <span className="text-3xl font-bold font-display text-white tracking-tight">
                    {currentMetrics.disk}
                  </span>
                  <span className="text-xs font-mono text-[#00E5FF]">%</span>
                </div>
              </div>
              <div className="p-1.5 rounded bg-neutral-900 border border-neutral-800 text-[#00E5FF] group-hover:border-[#00E5FF] transition-all">
                <HardDrive className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-2">
              <MonochromeChart data={metricHistory} dataKey="disk" height={50} showLabels={false} />
            </div>

            <div className="mt-2 pt-2 border-t border-neutral-800 flex items-center justify-between text-[9px] font-mono text-neutral-400">
              <span>{currentMetrics.iops.toLocaleString()} IOPS</span>
              <span className="text-white">4.2 TB / 8.0 TB</span>
            </div>
          </AntigravityCard>

            {/* Real Network Telemetry */}
            <AntigravityCard floatDelay="slow" depthZ={12} className="group">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      networkStrength.isOnline 
                        ? networkStrength.signalBars >= 3 ? 'bg-[#00E5FF] shadow-[0_0_6px_#00E5FF]' : 'bg-amber-400'
                        : 'bg-rose-500'
                    }`} />
                    <span className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase">
                      NETWORK // LIVE INGRESS
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-baseline gap-1">
                    <span className="text-3xl font-bold font-display text-white tracking-tight">
                      {networkStrength.isOnline ? networkStrength.downlinkMBps : 0}
                    </span>
                    <span className="text-xs font-mono text-[#00E5FF]">MB/s</span>
                    <span className="text-[10px] font-mono text-neutral-400 ml-1">
                      ({networkStrength.isOnline ? networkStrength.downlinkMbps : 0} Mbps)
                    </span>
                  </div>
                </div>
                <div className="p-1.5 rounded bg-neutral-900 border border-neutral-800 text-[#00E5FF] group-hover:border-[#00E5FF] transition-all">
                  <Wifi className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-2">
                <MonochromeChart data={metricHistory} dataKey="network" height={50} showLabels={false} unit="MB/s" />
              </div>

              <div className="mt-2 pt-2 border-t border-neutral-800 flex items-center justify-between text-[9px] font-mono text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <span className="text-neutral-300 font-semibold">{networkStrength.strengthPercentage}% SIGNAL</span>
                  <span>· {networkStrength.effectiveType.toUpperCase()}</span>
                </span>
                <span className={`font-semibold ${
                  !networkStrength.isOnline ? 'text-rose-400' :
                  networkStrength.pingMs <= 30 ? 'text-[#00E5FF]' :
                  networkStrength.pingMs <= 80 ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {networkStrength.isOnline ? `${networkStrength.pingMs} ms (RTT)` : 'OFFLINE'}
                </span>
              </div>
            </AntigravityCard>

        </div>
      </div>

      {/* Lower Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        
        {/* Node Fleet Overview */}
        <div className="lg:col-span-8">
          <AntigravityCard floatDelay="slow" depthZ={10} className="space-y-3 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-[#00E5FF]" />
                <span className="text-xs font-mono font-bold tracking-widest text-white uppercase">
                  CLUSTER NODE FLEET
                </span>
              </div>
              <button
                onClick={() => setView('devices')}
                className="text-xs font-mono text-[#00E5FF] hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>EXPLORE ALL</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {devices.slice(0, 6).map((node) => (
                <div
                  key={node.id}
                  onClick={() => {
                    setSelectedDevice(node);
                    setView('devices');
                  }}
                  className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-[#00E5FF]/60 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-white group-hover:text-[#00E5FF] truncate">
                      {node.name}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${node.status === 'online' ? 'bg-[#00E5FF] shadow-[0_0_6px_#00E5FF]' : 'bg-neutral-400'}`} />
                  </div>

                  <div className="text-[8px] font-mono text-neutral-400 mt-0.5 truncate">
                    {node.location}
                  </div>

                  <div className="mt-2 grid grid-cols-3 gap-1 pt-1.5 border-t border-neutral-800 text-center text-[9px] font-mono">
                    <div>
                      <span className="text-neutral-400 block text-[7px]">CPU</span>
                      <span className="text-white font-bold">{node.cpu}%</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[7px]">RAM</span>
                      <span className="text-white font-bold">{node.ram}%</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[7px]">TEMP</span>
                      <span className="text-white font-bold">{node.temp}°C</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AntigravityCard>
        </div>

        {/* Live Incident Ticker */}
        <div className="lg:col-span-4">
          <AntigravityCard floatDelay="mid" depthZ={10} className="space-y-3 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#00E5FF]" />
                <span className="text-xs font-mono font-bold tracking-widest text-white uppercase">
                  ACTIVE INCIDENTS
                </span>
              </div>
              <span className="text-[9px] font-mono text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded border border-[#00E5FF]/30 font-semibold">
                {alerts.length} LOGGED
              </span>
            </div>

            <div className="space-y-2">
              {alerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    alert.severity === 'critical'
                      ? 'bg-neutral-900 border-[#00E5FF]/80 text-white'
                      : 'bg-neutral-900/60 border-neutral-800 text-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[9px] font-mono font-bold text-[#00E5FF] uppercase">
                      {alert.severity === 'critical' ? '! CRITICAL' : alert.severity.toUpperCase()}
                    </span>
                    <span className="text-[8px] font-mono text-neutral-400">
                      {alert.timestamp}
                    </span>
                  </div>
                  <div className="text-xs font-mono font-semibold text-white">
                    {alert.title}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setView('alerts')}
              className="w-full py-1.5 rounded bg-white text-black hover:bg-[#00E5FF] font-bold text-xs font-mono transition-all text-center"
            >
              VIEW ALL
            </button>
          </AntigravityCard>
        </div>

      </div>

    </div>
  );
};
