import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext';
import { AntigravityCard } from '../ui/AntigravityCard';
import { 
  Cpu, 
  Search, 
  Trash2, 
  Zap, 
  Layers, 
  ShieldAlert, 
  Terminal,
  Activity,
  CheckCircle2
} from 'lucide-react';

export const ProcessesView: React.FC = () => {
  const { processes, killProcess, boostProcess, currentMetrics } = useSystem();
  const [search, setSearch] = useState('');
  const [statusAction, setStatusAction] = useState<string | null>(null);

  const filteredProcesses = processes.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.user.toLowerCase().includes(search.toLowerCase()) ||
    p.pid.toString().includes(search)
  );

  const handleKill = (pid: number, name: string) => {
    killProcess(pid);
    setStatusAction(`TERMINATED PROCESS ${name} [PID ${pid}]`);
    setTimeout(() => setStatusAction(null), 3000);
  };

  const handleBoost = (pid: number, name: string) => {
    boostProcess(pid);
    setStatusAction(`ELEVATED PRIORITY -> CRITICAL FOR ${name} [PID ${pid}]`);
    setTimeout(() => setStatusAction(null), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 select-none">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
              KERNEL THREAD SCHEDULER
            </span>
          </div>
          <h1 className="text-3xl font-bold font-display text-white tracking-wide mt-0.5">
            PROCESS & THREAD MATRIX
          </h1>
          <p className="text-xs font-mono text-neutral-400 mt-1">
            Real-time multi-core execution inspector. Real-time CPU & memory allocation monitoring.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search PID, name, user..."
            className="pl-8 pr-3 py-1.5 rounded-lg bg-neutral-950 border border-white/15 text-xs font-mono text-white placeholder-neutral-400 focus:outline-none focus:border-white/40"
          />
        </div>
      </div>

      {/* Status banner on action */}
      {statusAction && (
        <div className="p-3 rounded-lg bg-white text-black font-mono text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{statusAction}</span>
        </div>
      )}

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <AntigravityCard floatDelay="none" depthZ={8} className="p-4">
          <span className="text-[10px] font-mono text-neutral-400 uppercase block">ACTIVE THREADS</span>
          <div className="text-2xl font-bold font-display text-white mt-1">
            {processes.reduce((acc, p) => acc + p.threads, 0)}
          </div>
        </AntigravityCard>

        <AntigravityCard floatDelay="none" depthZ={8} className="p-4">
          <span className="text-[10px] font-mono text-neutral-400 uppercase block">TOTAL TASKS</span>
          <div className="text-2xl font-bold font-display text-white mt-1">
            {processes.length}
          </div>
        </AntigravityCard>

        <AntigravityCard floatDelay="none" depthZ={8} className="p-4">
          <span className="text-[10px] font-mono text-neutral-400 uppercase block">KERNEL CPU</span>
          <div className="text-2xl font-bold font-display text-white mt-1">
            {currentMetrics.cpu}%
          </div>
        </AntigravityCard>

        <AntigravityCard floatDelay="none" depthZ={8} className="p-4">
          <span className="text-[10px] font-mono text-neutral-400 uppercase block">MEM ALLOCATED</span>
          <div className="text-2xl font-bold font-display text-white mt-1">
            {(processes.reduce((acc, p) => acc + p.memoryMb, 0) / 1024).toFixed(1)} GB
          </div>
        </AntigravityCard>
      </div>

      {/* Process Table */}
      <AntigravityCard floatDelay="none" depthZ={12} className="overflow-x-auto p-0">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-white/10 bg-neutral-900/50 text-[10px] text-neutral-400 uppercase tracking-wider">
              <th className="py-3.5 px-4 font-normal">PID</th>
              <th className="py-3.5 px-4 font-normal">PROCESS DESIGNATION</th>
              <th className="py-3.5 px-4 font-normal">USER</th>
              <th className="py-3.5 px-4 font-normal">CPU</th>
              <th className="py-3.5 px-4 font-normal">MEMORY</th>
              <th className="py-3.5 px-4 font-normal">THREADS</th>
              <th className="py-3.5 px-4 font-normal">PRIORITY</th>
              <th className="py-3.5 px-4 font-normal text-right">CONTROLS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredProcesses.map((proc) => (
              <tr 
                key={proc.pid}
                className="hover:bg-neutral-900/60 transition-colors group"
              >
                <td className="py-3 px-4 text-neutral-400">{proc.pid}</td>
                <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  <span>{proc.name}</span>
                </td>
                <td className="py-3 px-4 text-neutral-400">{proc.user}</td>
                <td className="py-3 px-4 text-white font-semibold">{proc.cpu}%</td>
                <td className="py-3 px-4 text-neutral-300">{proc.memoryMb} MB</td>
                <td className="py-3 px-4 text-neutral-400">{proc.threads}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    proc.priority === 'CRITICAL' 
                      ? 'bg-white text-black font-extrabold' 
                      : proc.priority === 'HIGH' 
                      ? 'bg-neutral-800 text-white border border-white/20' 
                      : 'bg-neutral-950 text-neutral-400 border border-white/10'
                  }`}>
                    {proc.priority}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleBoost(proc.pid, proc.name)}
                      className="p-1.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-white/10 transition-colors"
                      title="Boost Thread Priority"
                    >
                      <Zap className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleKill(proc.pid, proc.name)}
                      className="p-1.5 rounded bg-neutral-900 hover:bg-white hover:text-black text-neutral-400 border border-white/10 transition-colors"
                      title="Terminate Process (SIGKILL)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AntigravityCard>

    </div>
  );
};
