export type ViewMode = 
  | 'dashboard' 
  | 'devices' 
  | 'topology' 
  | 'metrics' 
  | 'processes' 
  | 'alerts' 
  | 'settings' 
  | 'login';

export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface AlertItem {
  id: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  device: string;
  timestamp: string;
  acknowledged: boolean;
  metric?: string;
  value?: string;
}

export interface DeviceNode {
  id: string;
  name: string;
  type: 'hypervisor' | 'quantum-core' | 'database-cluster' | 'edge-gateway' | 'neural-accelerator' | 'storage-vault';
  status: 'online' | 'degraded' | 'offline' | 'calibrating';
  ip: string;
  location: string;
  cpu: number;
  ram: number;
  disk: number;
  temp: number;
  networkIn: number; // MB/s
  networkOut: number; // MB/s
  uptime: string;
  cores: number;
  frequencyGhz: number;
  lastPingMs: number;
}

export interface ProcessItem {
  pid: number;
  name: string;
  user: string;
  cpu: number;
  memoryMb: number;
  threads: number;
  priority: 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';
  status: 'RUNNING' | 'SLEEPING' | 'IDLE';
}

export interface MetricHistoryPoint {
  time: string;
  cpu: number;
  ram: number;
  disk: number;
  network: number;
  quantumDrift: number;
  thermalC: number;
}

export interface TopologyNode {
  id: string;
  label: string;
  sublabel: string;
  type: 'gateway' | 'balancer' | 'compute' | 'storage' | 'ai-core';
  x: number;
  y: number;
  z: number;
  status: 'optimal' | 'warning' | 'critical';
  connections: string[];
  latencyMs: number;
  throughputGbps: number;
}

export interface PhysicsConfig {
  gravityScale: number; // 0 (zero-g) to 1.5
  floatSpeed: number; // speed multiplier
  particleCount: number;
  parallaxIntensity: number;
  enableScanlines: boolean;
  enableSoundSim: boolean;
  highContrastMono: boolean;
}
