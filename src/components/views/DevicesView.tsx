import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext';
import { AntigravityCard } from '../ui/AntigravityCard';
import { DeviceDetailModal } from './DeviceDetailModal';
import { DeviceNode } from '../../types';
import { 
  Server, 
  Search, 
  Filter, 
  Cpu, 
  Database, 
  HardDrive, 
  Wifi, 
  Thermometer, 
  ArrowUpRight,
  Plus
} from 'lucide-react';

export const DevicesView: React.FC = () => {
  const { devices, selectedDevice, setSelectedDevice } = useSystem();
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredDevices = devices.filter(device => {
    const matchesType = filterType === 'all' || device.type === filterType;
    const matchesSearch = 
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.ip.includes(searchQuery);
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
              NODE FLEET REGISTRY
            </span>
          </div>
          <h1 className="text-3xl font-bold font-display text-white tracking-wide mt-0.5">
            SPATIAL NODE FLEET
          </h1>
          <p className="text-xs font-mono text-neutral-400 mt-1">
            Monitoring {devices.length} distributed enterprise hypervisors, cryo-cores, and vaults.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter nodes..."
              className="pl-8 pr-3 py-1.5 rounded-lg bg-neutral-950 border border-white/15 text-xs font-mono text-white placeholder-neutral-400 focus:outline-none focus:border-white/40"
            />
          </div>

          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-neutral-950 border border-white/15 text-xs font-mono text-neutral-300 focus:outline-none focus:border-white/40"
          >
            <option value="all">ALL NODE TYPES</option>
            <option value="hypervisor">HYPERVISOR</option>
            <option value="quantum-core">QUANTUM CORE</option>
            <option value="database-cluster">DATABASE CLUSTER</option>
            <option value="edge-gateway">EDGE GATEWAY</option>
            <option value="neural-accelerator">NEURAL ACCELERATOR</option>
            <option value="storage-vault">STORAGE VAULT</option>
          </select>
        </div>
      </div>

      {/* Floating Spatial Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDevices.map((device, index) => {
          const floatDelays = ['slow', 'mid', 'fast'] as const;
          const floatDelay = floatDelays[index % 3];

          return (
            <AntigravityCard
              key={device.id}
              floatDelay={floatDelay}
              depthZ={16}
              onClick={() => setSelectedDevice(device)}
              className="cursor-pointer group hover:border-white/40 transition-all"
            >
              <div className="flex flex-col justify-between h-full space-y-5">
                
                {/* Card Top: Node Name & Type */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${device.status === 'online' ? 'bg-white' : 'bg-neutral-400 pulse-warning'}`} />
                      <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                        {device.id}
                      </span>
                    </div>
                    <h3 className="text-base font-bold font-display text-white group-hover:text-white transition-colors">
                      {device.name}
                    </h3>
                    <p className="text-[10px] font-mono text-neutral-400 truncate">
                      {device.location}
                    </p>
                  </div>

                  <div className="p-2 rounded-lg bg-neutral-900 border border-white/10 text-neutral-400 group-hover:text-white transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Metric Bars */}
                <div className="space-y-2.5 pt-2 border-t border-white/10">
                  
                  {/* CPU */}
                  <div>
                    <div className="flex justify-between text-[10px] font-mono mb-1">
                      <span className="text-neutral-400">CPU LOAD</span>
                      <span className="text-white font-bold">{device.cpu}%</span>
                    </div>
                    <div className="w-full h-1 bg-neutral-900 rounded-full overflow-hidden border border-white/10">
                      <div
                        className="h-full bg-white transition-all duration-500"
                        style={{ width: `${device.cpu}%` }}
                      />
                    </div>
                  </div>

                  {/* RAM */}
                  <div>
                    <div className="flex justify-between text-[10px] font-mono mb-1">
                      <span className="text-neutral-400">RAM ALLOCATION</span>
                      <span className="text-white font-bold">{device.ram}%</span>
                    </div>
                    <div className="w-full h-1 bg-neutral-900 rounded-full overflow-hidden border border-white/10">
                      <div
                        className="h-full bg-neutral-300 transition-all duration-500"
                        style={{ width: `${device.ram}%` }}
                      />
                    </div>
                  </div>

                  {/* Storage */}
                  <div>
                    <div className="flex justify-between text-[10px] font-mono mb-1">
                      <span className="text-neutral-400">STORAGE NVMe</span>
                      <span className="text-white font-bold">{device.disk}%</span>
                    </div>
                    <div className="w-full h-1 bg-neutral-900 rounded-full overflow-hidden border border-white/10">
                      <div
                        className="h-full bg-neutral-400 transition-all duration-500"
                        style={{ width: `${device.disk}%` }}
                      />
                    </div>
                  </div>

                </div>

                {/* Footer Hardware Stats */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-center text-[10px] font-mono">
                  <div>
                    <span className="text-neutral-400 block text-[8px]">PING</span>
                    <span className="text-neutral-200">{device.lastPingMs} ms</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[8px]">TEMP</span>
                    <span className="text-neutral-200">{device.temp}°C</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[8px]">THROUGHPUT</span>
                    <span className="text-neutral-200">{device.networkIn} MB/s</span>
                  </div>
                </div>

              </div>
            </AntigravityCard>
          );
        })}
      </div>

      {/* Selected Device Modal */}
      {selectedDevice && (
        <DeviceDetailModal
          device={selectedDevice}
          onClose={() => setSelectedDevice(null)}
        />
      )}

    </div>
  );
};
