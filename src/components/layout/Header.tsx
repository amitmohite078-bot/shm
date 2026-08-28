import React, { useState, useEffect } from 'react';
import { useSystem } from '../../context/SystemContext';
import { NexoraLogo } from '../ui/NexoraLogo';
import { 
  Search, 
  Wifi,
  WifiOff, 
  Zap, 
  Terminal, 
  RotateCcw,
  Sliders,
  Activity,
  ArrowDownUp,
  RefreshCw,
  Signal,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    isOnline, 
    toggleOnline, 
    setIsCommandPaletteOpen,
    injectFault,
    resetTelemetry,
    setView,
    hasTelemetryPermission,
    openPermissionModal,
    networkStrength,
    triggerManualPingCheck
  } = useSystem();

  const [timeStr, setTimeStr] = useState('');
  const [showSimMenu, setShowSimMenu] = useState(false);
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [isPinging, setIsPinging] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(now.toISOString().replace('T', ' // ').slice(0, 22) + ' UTC');
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleManualPing = async () => {
    setIsPinging(true);
    await triggerManualPingCheck();
    setTimeout(() => setIsPinging(false), 500);
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'EXCELLENT': return 'text-[#00E5FF] border-[#00E5FF]/40 bg-[#00E5FF]/10';
      case 'GOOD': return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
      case 'FAIR': return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
      case 'POOR': return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
      default: return 'text-neutral-500 border-neutral-700 bg-neutral-900';
    }
  };

  const getPingColor = (ping: number) => {
    if (!isOnline || ping === 0) return 'text-neutral-500';
    if (ping <= 30) return 'text-[#00E5FF]';
    if (ping <= 80) return 'text-emerald-400';
    if (ping <= 180) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <header className="sticky top-0 z-40 w-full px-5 py-2.5 bg-black text-white border-b border-neutral-800 shadow-md select-none transition-all">
      <div className="flex items-center justify-between gap-4 w-full">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => setView('dashboard')}
            className="cursor-pointer transition-transform hover:opacity-95"
            title="Nexora Core Dashboard"
          >
            <NexoraLogo size="sm" showTagline={true} />
          </div>
        </div>

        {/* Center: Command Palette Trigger */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="w-full flex items-center justify-between px-3 py-1 rounded bg-neutral-900 border border-neutral-800 hover:border-[#00E5FF]/60 text-neutral-400 hover:text-white transition-all group text-xs font-mono"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span className="text-neutral-300 group-hover:text-white">
                Execute command, search nodes...
              </span>
            </div>
            <div className="flex items-center gap-1 text-[9px] text-[#00E5FF] bg-black px-1.5 py-0.5 rounded border border-neutral-800">
              <span>CTRL+K</span>
            </div>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Live UTC Timestamp */}
          <div className="hidden xl:flex items-center gap-2 text-[10px] font-mono text-neutral-300 bg-neutral-900 px-2.5 py-1 rounded border border-neutral-800">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] pulse-blue-dot" />
            <span>{timeStr}</span>
          </div>

          {/* Real Network Strength Status Widget */}
          <div className="relative">
            <button
              onClick={() => setShowNetworkModal(!showNetworkModal)}
              className={`flex items-center gap-2 px-2.5 py-1 rounded text-xs font-mono border transition-all ${
                !isOnline 
                  ? 'bg-neutral-950 border-rose-900/60 text-rose-400' 
                  : 'bg-neutral-900 border-neutral-800 hover:border-[#00E5FF]/60 text-white'
              }`}
              title="Real Network Strength & RTT Diagnostics"
            >
              {/* 4-Bar Signal Strength Meter */}
              <div className="flex items-end gap-[2px] h-3.5">
                {[1, 2, 3, 4].map((bar) => {
                  const isActive = isOnline && networkStrength.signalBars >= bar;
                  const barHeight = bar === 1 ? 'h-1.5' : bar === 2 ? 'h-2' : bar === 3 ? 'h-2.5' : 'h-3.5';
                  return (
                    <span
                      key={bar}
                      className={`w-[3px] rounded-xs transition-all ${barHeight} ${
                        isActive 
                          ? networkStrength.signalBars >= 3 
                            ? 'bg-[#00E5FF] shadow-[0_0_4px_#00E5FF]' 
                            : networkStrength.signalBars === 2 
                            ? 'bg-amber-400' 
                            : 'bg-rose-400'
                          : 'bg-neutral-700'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Ping RTT display */}
              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] font-bold ${getPingColor(networkStrength.pingMs)}`}>
                  {isOnline ? `${networkStrength.pingMs}ms` : 'OFFLINE'}
                </span>
                <span className="text-[9px] text-neutral-400 hidden sm:inline">
                  {isOnline ? `· ${networkStrength.effectiveType.toUpperCase()}` : ''}
                </span>
              </div>
            </button>

            {/* Network Diagnostics Popover */}
            {showNetworkModal && (
              <div 
                className="absolute right-0 mt-1.5 w-72 rounded-lg bg-black border border-neutral-800 shadow-2xl p-3 z-50 animate-in fade-in"
                onMouseLeave={() => setShowNetworkModal(false)}
              >
                <div className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest px-1 pb-2 border-b border-neutral-800 mb-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Signal className="w-3.5 h-3.5 text-[#00E5FF]" />
                    <span className="text-white font-bold">REAL NETWORK TELEMETRY</span>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded text-[8px] border font-bold ${getQualityColor(networkStrength.quality)}`}>
                    {networkStrength.quality}
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center py-1 border-b border-neutral-900">
                    <span className="text-neutral-400">STATUS</span>
                    <span className={`font-bold flex items-center gap-1 ${isOnline ? 'text-[#00E5FF]' : 'text-rose-400'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-[#00E5FF]' : 'bg-rose-400'}`} />
                      {isOnline ? 'ONLINE (ACTIVE)' : 'OFFLINE'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-neutral-900">
                    <span className="text-neutral-400">SIGNAL STRENGTH</span>
                    <span className="text-white font-bold">
                      {networkStrength.strengthPercentage}% ({networkStrength.signalBars}/4 BARS)
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-neutral-900">
                    <span className="text-neutral-400">MEASURED PING (RTT)</span>
                    <span className={`font-bold ${getPingColor(networkStrength.pingMs)}`}>
                      {networkStrength.pingMs} ms
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-neutral-900">
                    <span className="text-neutral-400">NETWORK JITTER</span>
                    <span className="text-white font-bold">
                      ±{networkStrength.jitterMs} ms
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-neutral-900">
                    <span className="text-neutral-400">BANDWIDTH (DOWNLINK)</span>
                    <span className="text-white font-bold">
                      {networkStrength.downlinkMbps} Mbps <span className="text-neutral-400 text-[10px]">({networkStrength.downlinkMBps} MB/s)</span>
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-neutral-900">
                    <span className="text-neutral-400">CONNECTION TYPE</span>
                    <span className="text-[#00E5FF] font-bold uppercase">
                      {networkStrength.connectionType} · {networkStrength.effectiveType}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-neutral-400">PACKET LOSS</span>
                    <span className={`font-bold ${networkStrength.packetLossPercent > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {networkStrength.packetLossPercent}%
                    </span>
                  </div>
                </div>

                <div className="border-t border-neutral-800 mt-2.5 pt-2 flex items-center justify-between gap-2">
                  <button
                    onClick={handleManualPing}
                    disabled={isPinging || !isOnline}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-[#00E5FF] text-[10px] font-mono text-white transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 text-[#00E5FF] ${isPinging ? 'animate-spin' : ''}`} />
                    <span>{isPinging ? 'PINGING...' : 'TEST REAL PING NOW'}</span>
                  </button>

                  <button
                    onClick={toggleOnline}
                    className={`py-1.5 px-2.5 rounded text-[10px] font-mono font-bold border transition-all ${
                      isOnline ? 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white' : 'bg-[#00E5FF] text-black border-[#00E5FF]'
                    }`}
                  >
                    {isOnline ? 'DISCONNECT' : 'RECONNECT'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Fault Simulation Console */}
          <div className="relative">
            <button
              onClick={() => setShowSimMenu(!showSimMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-[#00E5FF]/60 text-xs font-mono text-white transition-all"
              title="Telemetry Simulation"
            >
              <Zap className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span className="hidden sm:inline">SIMULATE</span>
            </button>

            {showSimMenu && (
              <div 
                className="absolute right-0 mt-1.5 w-60 rounded-lg bg-black border border-neutral-800 shadow-2xl p-2 z-50 animate-in fade-in"
                onMouseLeave={() => setShowSimMenu(false)}
              >
                <div className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest px-2 py-1 border-b border-neutral-800 mb-1 flex items-center justify-between">
                  <span className="text-[#00E5FF] font-bold">GoF Command Injector</span>
                  <Terminal className="w-3 h-3 text-[#00E5FF]" />
                </div>
                
                <div className="space-y-0.5">
                  <button
                    onClick={() => { injectFault('cpu_spike'); setShowSimMenu(false); }}
                    className="w-full text-left px-2 py-1 rounded text-[11px] font-mono hover:bg-neutral-900 text-neutral-200 hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>CPU Overload</span>
                    <span className="text-[9px] text-[#00E5FF]">94%</span>
                  </button>
                  <button
                    onClick={() => { injectFault('mem_leak'); setShowSimMenu(false); }}
                    className="w-full text-left px-2 py-1 rounded text-[11px] font-mono hover:bg-neutral-900 text-neutral-200 hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>Memory Pressure</span>
                    <span className="text-[9px] text-[#00E5FF]">92%</span>
                  </button>
                  <button
                    onClick={() => { injectFault('network_drop'); setShowSimMenu(false); }}
                    className="w-full text-left px-2 py-1 rounded text-[11px] font-mono hover:bg-neutral-900 text-neutral-200 hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>Packet Drop & Latency Spike</span>
                    <span className="text-[9px] text-rose-400">CRIT</span>
                  </button>
                  <button
                    onClick={() => { injectFault('quantum_drift'); setShowSimMenu(false); }}
                    className="w-full text-left px-2 py-1 rounded text-[11px] font-mono hover:bg-neutral-900 text-neutral-200 hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>Quantum Drift</span>
                    <span className="text-[9px] text-[#00E5FF]">DRIFT</span>
                  </button>
                </div>

                <div className="border-t border-neutral-800 mt-1 pt-1">
                  <button
                    onClick={() => { resetTelemetry(); setShowSimMenu(false); }}
                    className="w-full text-left px-2 py-1 rounded text-[11px] font-mono hover:bg-neutral-900 text-white transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3 h-3 text-[#00E5FF]" />
                    <span>Normalize Baseline</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Real Hardware Permission Status Indicator */}
          <button
            onClick={openPermissionModal}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono border transition-all ${
              hasTelemetryPermission 
                ? 'bg-neutral-900 border-[#00E5FF]/40 text-[#00E5FF] hover:border-[#00E5FF]' 
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
            title="Configure Real Host Hardware Telemetry Permissions"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${hasTelemetryPermission ? 'bg-[#00E5FF] shadow-[0_0_6px_#00E5FF]' : 'bg-neutral-500'}`} />
            <span className="text-[10px] tracking-wider hidden md:inline">
              {hasTelemetryPermission ? 'REAL HOST ACCESS' : 'DEMO MODE'}
            </span>
          </button>

          {/* Connection Status Button */}
          <button
            onClick={toggleOnline}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono border transition-all ${
              isOnline 
                ? 'bg-neutral-900 border-neutral-800 text-white hover:border-[#00E5FF]' 
                : 'bg-[#00E5FF] text-black font-bold border-[#00E5FF]'
            }`}
          >
            {isOnline ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_6px_#00E5FF]" />
                <span className="text-[10px] tracking-wider">CONNECTED</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-black" />
                <span className="text-[10px] tracking-wider">OFFLINE</span>
              </>
            )}
          </button>

          {/* Settings Icon */}
          <button
            onClick={() => setView('settings')}
            className="p-1.5 rounded bg-neutral-900 border border-neutral-800 hover:border-[#00E5FF] text-neutral-300 hover:text-white transition-all"
            title="Antigravity Physics"
          >
            <Sliders className="w-3.5 h-3.5 text-[#00E5FF]" />
          </button>

        </div>
      </div>
    </header>
  );
};
