import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext';
import { AntigravityCard } from '../ui/AntigravityCard';
import { MonochromeChart } from '../ui/MonochromeChart';
import { 
  Activity, 
  Cpu, 
  Database, 
  HardDrive, 
  Wifi, 
  Thermometer, 
  Zap, 
  Sparkles,
  Layers
} from 'lucide-react';

export const MetricsView: React.FC = () => {
  const { metricHistory, currentMetrics } = useSystem();
  const [timeRange, setTimeRange] = useState<'1m' | '5m' | '15m' | '1h'>('5m');

  return (
    <div className="space-y-8 animate-in fade-in duration-300 select-none">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
              HIGH-PRECISION TELEMETRY STREAM
            </span>
          </div>
          <h1 className="text-3xl font-bold font-display text-white tracking-wide mt-0.5">
            DEEP METRICS INSPECTOR
          </h1>
          <p className="text-xs font-mono text-neutral-400 mt-1">
            Real-time multi-dimensional timeseries buffer with sub-millisecond precision.
          </p>
        </div>

        {/* Time Resolution Toggles */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-neutral-950 border border-white/15">
          {(['1m', '5m', '15m', '1h'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                timeRange === range
                  ? 'bg-white text-black font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Chart Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CPU Telemetry */}
        <AntigravityCard floatDelay="slow" depthZ={14}>
          <MonochromeChart
            data={metricHistory}
            dataKey="cpu"
            height={160}
            unit="%"
          />
          <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-[10px] font-mono text-neutral-400">
            <div>PEAK: <span className="text-white">96%</span></div>
            <div>AVG: <span className="text-white">41.2%</span></div>
            <div>CURRENT: <span className="text-white font-bold">{currentMetrics.cpu}%</span></div>
          </div>
        </AntigravityCard>

        {/* RAM Telemetry */}
        <AntigravityCard floatDelay="mid" depthZ={14}>
          <MonochromeChart
            data={metricHistory}
            dataKey="ram"
            height={160}
            unit="%"
          />
          <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-[10px] font-mono text-neutral-400">
            <div>USED: <span className="text-white">87.4 GB</span></div>
            <div>TOTAL: <span className="text-white">128 GB</span></div>
            <div>CURRENT: <span className="text-white font-bold">{currentMetrics.ram}%</span></div>
          </div>
        </AntigravityCard>

        {/* Network Ingress */}
        <AntigravityCard floatDelay="fast" depthZ={14}>
          <MonochromeChart
            data={metricHistory}
            dataKey="network"
            height={160}
            unit="MB/s"
          />
          <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-[10px] font-mono text-neutral-400">
            <div>PACKETS: <span className="text-white">1.8M/s</span></div>
            <div>DROPS: <span className="text-white">0.00%</span></div>
            <div>THROUGHPUT: <span className="text-white font-bold">{currentMetrics.network} MB/s</span></div>
          </div>
        </AntigravityCard>

        {/* Quantum Decoherence / Drift */}
        <AntigravityCard floatDelay="slow" depthZ={14}>
          <MonochromeChart
            data={metricHistory}
            dataKey="quantumDrift"
            height={160}
            unit="ps"
          />
          <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-[10px] font-mono text-neutral-400">
            <div>CRITICAL: <span className="text-white">&gt; 0.50 ps</span></div>
            <div>COHERENCE: <span className="text-white">99.8%</span></div>
            <div>DRIFT: <span className="text-white font-bold">{currentMetrics.quantumDrift} ps</span></div>
          </div>
        </AntigravityCard>

      </div>

      {/* Lower Hardware Telemetry Matrix */}
      <AntigravityCard floatDelay="none" depthZ={10} className="space-y-4">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <Zap className="w-4 h-4 text-white" />
          <span className="text-xs font-mono font-bold tracking-widest text-white uppercase">
            HARDWARE TELEMETRY & POWER DRAW
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 rounded-lg bg-neutral-900/60 border border-white/10">
            <span className="text-[10px] text-neutral-400 block">TOTAL POWER DRAW</span>
            <div className="text-2xl font-bold text-white mt-1 font-display">
              {currentMetrics.powerWatts} <span className="text-xs font-mono text-neutral-400">W</span>
            </div>
            <span className="text-[9px] text-neutral-400 mt-1 block">98.2% Power Efficiency</span>
          </div>

          <div className="p-3 rounded-lg bg-neutral-900/60 border border-white/10">
            <span className="text-[10px] text-neutral-400 block">NVMe DISK IOPS</span>
            <div className="text-2xl font-bold text-white mt-1 font-display">
              {(currentMetrics.iops / 1000).toFixed(1)}k
            </div>
            <span className="text-[9px] text-neutral-400 mt-1 block">Read/Write Vector Burst</span>
          </div>

          <div className="p-3 rounded-lg bg-neutral-900/60 border border-white/10">
            <span className="text-[10px] text-neutral-400 block">THERMAL GRADIENT</span>
            <div className="text-2xl font-bold text-white mt-1 font-display">
              {currentMetrics.thermalC} <span className="text-xs font-mono text-neutral-400">°C</span>
            </div>
            <span className="text-[9px] text-neutral-400 mt-1 block">Target Ceiling: 85°C</span>
          </div>

          <div className="p-3 rounded-lg bg-neutral-900/60 border border-white/10">
            <span className="text-[10px] text-neutral-400 block">CRYOGENIC COHERENCE</span>
            <div className="text-2xl font-bold text-white mt-1 font-display">
              99.94 <span className="text-xs font-mono text-neutral-400">%</span>
            </div>
            <span className="text-[9px] text-neutral-400 mt-1 block">Qubit Drift Minimized</span>
          </div>
        </div>
      </AntigravityCard>

    </div>
  );
};
