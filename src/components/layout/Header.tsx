import React, { useState, useEffect } from 'react';
import { useSystem } from '../../context/SystemContext';
import { 
  Search, 
  WifiOff, 
  Zap, 
  Terminal, 
  RotateCcw,
  Sliders
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
    openPermissionModal
  } = useSystem();

  const [timeStr, setTimeStr] = useState('');
  const [showSimMenu, setShowSimMenu] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(now.toISOString().replace('T', ' // ').slice(0, 22) + ' UTC');
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full px-5 py-2.5 bg-black text-white border-b border-neutral-800 shadow-md select-none transition-all">
      <div className="flex items-center justify-between gap-4 w-full">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => setView('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative w-8 h-8 rounded-lg bg-neutral-950 border border-[#00E5FF]/40 flex items-center justify-center group-hover:border-[#00E5FF] transition-all shadow-[0_0_10px_rgba(0,229,255,0.2)]">
              <div className="w-2.5 h-2.5 bg-[#00E5FF] rounded-full shadow-[0_0_6px_#00E5FF]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-sm tracking-widest text-white">
                  NEXORA
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30 font-semibold">
                  2035
                </span>
              </div>
              <p className="text-[9px] font-mono text-neutral-400 tracking-wider">
                CORE TELEMETRY MATRIX
              </p>
            </div>
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
                    <span>Packet Drop</span>
                    <span className="text-[9px] text-[#00E5FF]">CRIT</span>
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
