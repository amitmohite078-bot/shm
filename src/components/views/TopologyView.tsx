import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext';
import { AntigravityCard } from '../ui/AntigravityCard';
import { TopologyNode } from '../../types';
import { 
  Network, 
  Globe, 
  Cpu, 
  Database, 
  Server, 
  Layers, 
  Activity, 
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';

export const TopologyView: React.FC = () => {
  const { topologyNodes } = useSystem();
  const [selectedNode, setSelectedNode] = useState<TopologyNode | null>(topologyNodes[0]);

  // Topology node layout positions in 2.5D spatial SVG
  const nodeCoordinates: Record<string, { x: number; y: number }> = {
    'TOP-GW': { x: 450, y: 80 },
    'TOP-LB1': { x: 260, y: 190 },
    'TOP-LB2': { x: 640, y: 190 },
    'TOP-COMP1': { x: 180, y: 330 },
    'TOP-COMP2': { x: 450, y: 330 },
    'TOP-AI': { x: 720, y: 330 },
    'TOP-STOR': { x: 450, y: 460 },
  };

  const connections = [
    { from: 'TOP-GW', to: 'TOP-LB1', speed: '98.4 Gbps' },
    { from: 'TOP-GW', to: 'TOP-LB2', speed: '98.4 Gbps' },
    { from: 'TOP-LB1', to: 'TOP-COMP1', speed: '48.2 Gbps' },
    { from: 'TOP-LB1', to: 'TOP-COMP2', speed: '48.2 Gbps' },
    { from: 'TOP-LB2', to: 'TOP-COMP2', speed: '50.2 Gbps' },
    { from: 'TOP-LB2', to: 'TOP-AI', speed: '50.2 Gbps' },
    { from: 'TOP-COMP1', to: 'TOP-STOR', speed: '34.1 Gbps' },
    { from: 'TOP-COMP2', to: 'TOP-STOR', speed: '62.0 Gbps' },
    { from: 'TOP-AI', to: 'TOP-STOR', speed: '76.5 Gbps' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 select-none">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
              NETWORK MESH & PACKET ROUTING
            </span>
          </div>
          <h1 className="text-3xl font-bold font-display text-white tracking-wide mt-0.5">
            SPATIAL NETWORK TOPOLOGY
          </h1>
          <p className="text-xs font-mono text-neutral-400 mt-1">
            2035 Zero-Latency Quantum Mesh. Real-time packet paths & telemetry routing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-300 bg-neutral-950 px-3 py-1.5 rounded-lg border border-white/15">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>MESH PACKET VELOCITY: 480 Tbps</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Topology Canvas + Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Spatial Topology Graph (SVG Canvas) */}
        <div className="lg:col-span-8">
          <AntigravityCard floatDelay="none" depthZ={14} className="relative overflow-hidden p-4 min-h-[560px] flex items-center justify-center bg-black">

            <svg viewBox="0 0 900 540" className="w-full h-full max-h-[540px]">
              <defs>
                {/* Monochrome animated packet dash */}
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#333333" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {/* Animated Connection Lines */}
              {connections.map((conn, idx) => {
                const c1 = nodeCoordinates[conn.from];
                const c2 = nodeCoordinates[conn.to];
                if (!c1 || !c2) return null;

                const isConnectedToSelected =
                  selectedNode?.id === conn.from || selectedNode?.id === conn.to;

                return (
                  <g key={idx}>
                    {/* Base wire */}
                    <line
                      x1={c1.x}
                      y1={c1.y}
                      x2={c2.x}
                      y2={c2.y}
                      stroke={isConnectedToSelected ? '#ffffff' : '#333333'}
                      strokeWidth={isConnectedToSelected ? 2 : 1}
                      strokeDasharray={isConnectedToSelected ? '4 4' : 'none'}
                      opacity={isConnectedToSelected ? 0.9 : 0.4}
                      className="transition-all duration-300"
                    />

                    {/* Animated moving packet marker */}
                    <circle r="3" fill="#ffffff" opacity="0.9">
                      <animateMotion
                        path={`M ${c1.x} ${c1.y} L ${c2.x} ${c2.y}`}
                        dur={`${2.0 + (idx % 3) * 0.8}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>
                );
              })}

              {/* Interactive Nodes */}
              {topologyNodes.map((node) => {
                const coords = nodeCoordinates[node.id];
                if (!coords) return null;
                const isSelected = selectedNode?.id === node.id;

                return (
                  <g
                    key={node.id}
                    transform={`translate(${coords.x}, ${coords.y})`}
                    onClick={() => setSelectedNode(node)}
                    className="cursor-pointer group"
                  >
                    {/* Outer floating selection ring */}
                    {isSelected && (
                      <circle
                        r="34"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                        className="animate-spin origin-center"
                      />
                    )}

                    {/* Node base body */}
                    <circle
                      r="26"
                      fill={isSelected ? '#171717' : '#0a0a0a'}
                      stroke={isSelected ? '#ffffff' : '#404040'}
                      strokeWidth="1.5"
                      className="transition-all duration-200 group-hover:stroke-white shadow-2xl"
                    />

                    {/* Node Center Icon Dot */}
                    <circle
                      r="6"
                      fill="#ffffff"
                      opacity={isSelected ? 1 : 0.7}
                      className={node.status === 'warning' ? 'pulse-warning' : ''}
                    />

                    {/* Node Label */}
                    <text
                      y="42"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                      letterSpacing="0.05em"
                    >
                      {node.label}
                    </text>

                    {/* Sublabel */}
                    <text
                      y="54"
                      textAnchor="middle"
                      fill="#737373"
                      fontSize="8"
                      fontFamily="monospace"
                    >
                      {node.latencyMs}ms · {node.throughputGbps}G
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Bottom Legend */}
            <div className="absolute bottom-3 left-4 flex items-center gap-4 text-[10px] font-mono text-neutral-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-white" /> OPTIMAL ROUTE
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-neutral-400 pulse-warning" /> HIGH PRESSURE
              </span>
            </div>
          </AntigravityCard>
        </div>

        {/* Node Inspector Drawer */}
        <div className="lg:col-span-4">
          <AntigravityCard floatDelay="mid" depthZ={16} className="space-y-6">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Network className="w-4 h-4 text-white" />
                <span className="text-xs font-mono font-bold tracking-widest text-white uppercase">
                  NODE ROUTING INSPECTOR
                </span>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">
                ACTIVE
              </span>
            </div>

            {selectedNode ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-white" />
                    <h3 className="text-lg font-bold font-display text-white">
                      {selectedNode.label}
                    </h3>
                  </div>
                  <p className="text-xs font-mono text-neutral-400 mt-1">
                    {selectedNode.sublabel} · Node ID: {selectedNode.id}
                  </p>
                </div>

                {/* Specs Box */}
                <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/10 space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">STATUS</span>
                    <span className="text-white font-bold uppercase">{selectedNode.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">LATENCY (RTT)</span>
                    <span className="text-white">{selectedNode.latencyMs} ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">MAX BANDWIDTH</span>
                    <span className="text-white">{selectedNode.throughputGbps} Gbps</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">NODE CLASS</span>
                    <span className="text-white uppercase">{selectedNode.type}</span>
                  </div>
                </div>

                {/* Routing Table */}
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-2 font-semibold">
                    DIRECT ROUTING CONNECTIONS ({selectedNode.connections.length})
                  </span>
                  
                  <div className="space-y-1.5">
                    {selectedNode.connections.map((targetId) => (
                      <div
                        key={targetId}
                        onClick={() => {
                          const target = topologyNodes.find(n => n.id === targetId);
                          if (target) setSelectedNode(target);
                        }}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-900 border border-white/10 hover:border-white/30 cursor-pointer text-xs font-mono text-neutral-200 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{targetId}</span>
                        </div>
                        <span className="text-[10px] text-neutral-400">DIRECT PIPE</span>
                      </div>
                    ))}
                    {selectedNode.connections.length === 0 && (
                      <div className="text-xs font-mono text-neutral-400 py-3 text-center border border-dashed border-white/10 rounded-lg">
                        TERMINAL ENDPOINT NODE
                      </div>
                    )}
                  </div>
                </div>

              </div>
            ) : (
              <div className="py-12 text-center text-xs font-mono text-neutral-400">
                SELECT A NODE ON THE MESH TO INSPECT ROUTING TELEMETRY
              </div>
            )}

          </AntigravityCard>
        </div>

      </div>

    </div>
  );
};
