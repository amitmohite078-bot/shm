import React, { useState, useEffect, useRef } from 'react';
import { useSystem } from '../../context/SystemContext';
import { 
  Search, 
  Terminal, 
  Server, 
  Activity, 
  AlertTriangle, 
  Cpu, 
  Network, 
  Zap, 
  Sliders, 
  RotateCcw,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const { 
    isCommandPaletteOpen, 
    setIsCommandPaletteOpen, 
    setView, 
    devices, 
    setSelectedDevice,
    injectFault,
    resetTelemetry,
    toggleOnline,
    isOnline
  } = useSystem();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  // Command items catalog
  const commands = [
    { id: 'view_dash', category: 'Navigation', title: 'Open System Dashboard', sub: 'Primary 3D System Core & Health', icon: Activity, action: () => setView('dashboard') },
    { id: 'view_nodes', category: 'Navigation', title: 'Inspect Node Fleet', sub: 'All 6 cluster units & status', icon: Server, action: () => setView('devices') },
    { id: 'view_topo', category: 'Navigation', title: 'Open 3D Mesh Topology', sub: 'Interactive network routing map', icon: Network, action: () => setView('topology') },
    { id: 'view_metrics', category: 'Navigation', title: 'Open Deep Metrics', sub: 'Quantum drift & thermal telemetry', icon: Activity, action: () => setView('metrics') },
    { id: 'view_proc', category: 'Navigation', title: 'Open Process Inspector', sub: 'Kernel thread tree & PID killer', icon: Cpu, action: () => setView('processes') },
    { id: 'view_alerts', category: 'Navigation', title: 'Open Alert Hub', sub: 'Active incidents and logs', icon: AlertTriangle, action: () => setView('alerts') },
    { id: 'view_settings', category: 'Navigation', title: 'Configure Antigravity Physics', sub: 'Gravity scale, particles, parallax', icon: Sliders, action: () => setView('settings') },
    
    // Anomaly / Stress tests
    { id: 'sim_cpu', category: 'Stress Simulation', title: 'Inject CPU Overload (94%)', sub: 'Triggers critical thermal alert', icon: Zap, action: () => injectFault('cpu_spike') },
    { id: 'sim_mem', category: 'Stress Simulation', title: 'Inject Memory Pool Fragmentation (92%)', sub: 'Triggers cache warning', icon: Zap, action: () => injectFault('mem_leak') },
    { id: 'sim_net', category: 'Stress Simulation', title: 'Inject Ingress Packet Drop', sub: 'Triggers network alert', icon: Zap, action: () => injectFault('network_drop') },
    { id: 'sim_drift', category: 'Stress Simulation', title: 'Inject Quantum Decoherence', sub: 'Triggers cryo cell drift', icon: Zap, action: () => injectFault('quantum_drift') },
    { id: 'sim_reset', category: 'Maintenance', title: 'Normalize System Telemetry', sub: 'Reset baseline and clear criticals', icon: RotateCcw, action: () => resetTelemetry() },
    { id: 'sim_net_toggle', category: 'Maintenance', title: isOnline ? 'Simulate Gateway Disconnect' : 'Reconnect Matrix Gateway', sub: 'Toggle network connectivity', icon: Terminal, action: () => toggleOnline() },
  ];

  // Also include devices in search
  devices.forEach(dev => {
    commands.push({
      id: `dev_${dev.id}`,
      category: 'Nodes',
      title: `Node: ${dev.name} [${dev.id}]`,
      sub: `${dev.ip} · ${dev.location} · CPU: ${dev.cpu}%`,
      icon: Server,
      action: () => {
        setSelectedDevice(dev);
        setView('devices');
      }
    });
  });

  const filtered = commands.filter(c => 
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.sub.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
        setIsCommandPaletteOpen(false);
      }
    }
  };

  if (!isCommandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl rounded-2xl bg-neutral-950/95 border border-white/20 shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden hud-brackets animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Search Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-black/60">
          <Terminal className="w-5 h-5 text-white" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command, inspect node, or inject telemetry anomaly..."
            className="flex-1 bg-transparent text-sm font-mono text-white placeholder-neutral-400 focus:outline-none"
          />
          <kbd className="px-2 py-0.5 text-[10px] font-mono text-neutral-400 bg-neutral-900 border border-white/15 rounded">
            ESC TO EXIT
          </kbd>
        </div>

        {/* Command list */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono text-neutral-400">
              NO COMMAND OR NODE MATCHING "{query}"
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    item.action();
                    setIsCommandPaletteOpen(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`
                    flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all
                    ${isSelected 
                      ? 'bg-white text-black font-medium shadow-[0_0_15px_rgba(255,255,255,0.2)]' 
                      : 'text-neutral-300 hover:bg-neutral-900'
                    }
                  `}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-black text-white' : 'bg-neutral-900 text-neutral-400 border border-white/10'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-mono truncate">{item.title}</div>
                      <div className={`text-[10px] font-mono truncate ${isSelected ? 'text-neutral-700' : 'text-neutral-400'}`}>
                        {item.sub}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded ${
                      isSelected ? 'bg-neutral-200 text-black' : 'bg-neutral-900 text-neutral-400 border border-white/10'
                    }`}>
                      {item.category}
                    </span>
                    {isSelected && <ArrowRight className="w-3.5 h-3.5 text-black" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 bg-neutral-900/80 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-neutral-400">
          <div className="flex items-center gap-4">
            <span>↑↓ Navigate</span>
            <span>↵ Execute</span>
          </div>
          <span>ANTIGRAVITY // 2035 COMMAND PROTOCOL</span>
        </div>
      </div>
    </div>
  );
};
