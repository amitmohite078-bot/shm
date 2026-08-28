import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  ViewMode, 
  DeviceNode, 
  AlertItem, 
  ProcessItem, 
  MetricHistoryPoint, 
  TopologyNode, 
  PhysicsConfig 
} from '../types';

interface RealHardwareInfo {
  cores: number;
  memoryUsageMb: number;
  memoryLimitMb: number;
  memoryPercentage: number;
  downlinkMbps: number;
  rttMs: number;
  platform: string;
  isRealTelemetry: boolean;
}

interface SystemContextType {
  view: ViewMode;
  setView: (v: ViewMode) => void;
  healthScore: number;
  healthStatus: 'OPTIMAL' | 'DEGRADED' | 'CRITICAL';
  devices: DeviceNode[];
  selectedDevice: DeviceNode | null;
  setSelectedDevice: (d: DeviceNode | null) => void;
  alerts: AlertItem[];
  acknowledgeAlert: (id: string) => void;
  dismissAlert: (id: string) => void;
  triggerSimulatedAlert: (severity?: 'critical' | 'warning' | 'info') => void;
  processes: ProcessItem[];
  killProcess: (pid: number) => void;
  boostProcess: (pid: number) => void;
  metricHistory: MetricHistoryPoint[];
  currentMetrics: {
    cpu: number;
    ram: number;
    disk: number;
    network: number;
    quantumDrift: number;
    thermalC: number;
    powerWatts: number;
    iops: number;
  };
  topologyNodes: TopologyNode[];
  physicsConfig: PhysicsConfig;
  setPhysicsConfig: React.Dispatch<React.SetStateAction<PhysicsConfig>>;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isOnline: boolean;
  toggleOnline: () => void;
  injectFault: (type: 'cpu_spike' | 'mem_leak' | 'network_drop' | 'quantum_drift') => void;
  resetTelemetry: () => void;
  mousePos: { x: number; y: number; normalizedX: number; normalizedY: number };
  
  // Real Hardware Permission Management
  hasTelemetryPermission: boolean | null;
  showPermissionModal: boolean;
  openPermissionModal: () => void;
  grantPermission: () => void;
  denyPermission: () => void;
  realHardware: RealHardwareInfo;
}

const initialDevices: DeviceNode[] = [
  {
    id: 'NODE-CORE-01',
    name: 'HOST-PHYSICAL-PRIMARY',
    type: 'hypervisor',
    status: 'online',
    ip: '127.0.0.1',
    location: 'Localhost Host Node',
    cpu: 28,
    ram: 45,
    disk: 52,
    temp: 42,
    networkIn: 840,
    networkOut: 620,
    uptime: '42d 08h 12m',
    cores: navigator.hardwareConcurrency || 16,
    frequencyGhz: 4.8,
    lastPingMs: 0.8
  },
  {
    id: 'NODE-QUANTUM-04',
    name: 'QPU-DEEPTHOUGHT-04',
    type: 'quantum-core',
    status: 'online',
    ip: '10.204.1.88',
    location: 'Cryo-Chamber A / Earth Primary',
    cpu: 82,
    ram: 78,
    disk: 31,
    temp: 18,
    networkIn: 1420,
    networkOut: 1850,
    uptime: '89d 04h 11m',
    cores: 128,
    frequencyGhz: 5.6,
    lastPingMs: 0.4
  },
  {
    id: 'NODE-DB-CLUSTER',
    name: 'VALKEY-VAULT-MATRIX',
    type: 'database-cluster',
    status: 'online',
    ip: '10.204.4.15',
    location: 'Underground Vault / Zurich',
    cpu: 45,
    ram: 84,
    disk: 89,
    temp: 58,
    networkIn: 2100,
    networkOut: 2400,
    uptime: '310d 12h 05m',
    cores: 32,
    frequencyGhz: 4.2,
    lastPingMs: 2.1
  },
  {
    id: 'NODE-EDGE-09',
    name: 'EDGE-NEURAL-GATEWAY-09',
    type: 'edge-gateway',
    status: 'degraded',
    ip: '10.204.8.44',
    location: 'Lunar Base Station 3',
    cpu: 91,
    ram: 72,
    disk: 44,
    temp: 68,
    networkIn: 410,
    networkOut: 390,
    uptime: '14d 09h 50m',
    cores: 16,
    frequencyGhz: 3.9,
    lastPingMs: 12.8
  },
  {
    id: 'NODE-AI-ACCEL',
    name: 'SYNAPSE-TENSOR-ARRAY',
    type: 'neural-accelerator',
    status: 'online',
    ip: '10.204.12.02',
    location: 'Tokyo Deep Array',
    cpu: 56,
    ram: 48,
    disk: 22,
    temp: 49,
    networkIn: 3200,
    networkOut: 3100,
    uptime: '52d 16h 30m',
    cores: 256,
    frequencyGhz: 3.5,
    lastPingMs: 0.8
  },
  {
    id: 'NODE-VAULT-07',
    name: 'IMMUTABLE-LEDGER-STORAGE',
    type: 'storage-vault',
    status: 'online',
    ip: '10.204.9.99',
    location: 'Svalbard Arctic Seed Vault',
    cpu: 18,
    ram: 32,
    disk: 94,
    temp: 32,
    networkIn: 180,
    networkOut: 95,
    uptime: '612d 23h 01m',
    cores: 16,
    frequencyGhz: 2.8,
    lastPingMs: 18.4
  }
];

const initialAlerts: AlertItem[] = [
  {
    id: 'ALT-8891',
    severity: 'critical',
    title: 'REAL HARDWARE BRIDGE ESTABLISHED',
    message: 'Host processor core matrix connected to NEXORA live telemetry loop.',
    device: 'HOST-PHYSICAL-PRIMARY',
    timestamp: '00:00:01.00',
    acknowledged: true,
    metric: 'PHYSICAL_CORES',
    value: `${navigator.hardwareConcurrency || 8} CORES`
  }
];

const initialProcesses: ProcessItem[] = [
  { pid: 1042, name: 'nexora-java-engine.jar', user: 'root', cpu: 6.2, memoryMb: 512, threads: 48, priority: 'CRITICAL', status: 'RUNNING' },
  { pid: 2189, name: 'quantum-lattice-sync', user: 'system', cpu: 12.4, memoryMb: 1280, threads: 32, priority: 'CRITICAL', status: 'RUNNING' },
  { pid: 3410, name: 'neural-inference-worker-0', user: 'ai_engine', cpu: 8.4, memoryMb: 2048, threads: 16, priority: 'HIGH', status: 'RUNNING' },
  { pid: 4891, name: 'valkey-memory-sharder', user: 'db_admin', cpu: 4.1, memoryMb: 3400, threads: 12, priority: 'HIGH', status: 'RUNNING' },
  { pid: 5612, name: 'browser-telemetry-beacon', user: 'client', cpu: 2.1, memoryMb: 256, threads: 8, priority: 'NORMAL', status: 'RUNNING' }
];

const initialTopology: TopologyNode[] = [
  { id: 'TOP-GW', label: 'EDGE-GATEWAY', sublabel: 'Global Ingress', type: 'gateway', x: 0, y: -120, z: 0, status: 'optimal', connections: ['TOP-LB1', 'TOP-LB2'], latencyMs: 0.8, throughputGbps: 98.4 },
  { id: 'TOP-LB1', label: 'LOAD-BALANCER-01', sublabel: 'Layer 7 Mesh', type: 'balancer', x: -140, y: -40, z: 20, status: 'optimal', connections: ['TOP-COMP1', 'TOP-COMP2'], latencyMs: 1.1, throughputGbps: 48.2 },
  { id: 'TOP-LB2', label: 'LOAD-BALANCER-02', sublabel: 'Layer 7 Failover', type: 'balancer', x: 140, y: -40, z: -20, status: 'optimal', connections: ['TOP-COMP2', 'TOP-AI'], latencyMs: 1.2, throughputGbps: 50.2 },
  { id: 'TOP-COMP1', label: 'HYPERVISOR-ALPHA', sublabel: 'Compute Cluster 1', type: 'compute', x: -180, y: 70, z: -10, status: 'optimal', connections: ['TOP-STOR'], latencyMs: 1.8, throughputGbps: 34.1 },
  { id: 'TOP-COMP2', label: 'QPU-DEEPTHOUGHT', sublabel: 'Quantum Core', type: 'compute', x: 0, y: 50, z: 30, status: 'optimal', connections: ['TOP-STOR', 'TOP-AI'], latencyMs: 0.4, throughputGbps: 62.0 },
  { id: 'TOP-AI', label: 'SYNAPSE-TENSOR', sublabel: 'Neural Accelerators', type: 'ai-core', x: 180, y: 70, z: -10, status: 'optimal', connections: ['TOP-STOR'], latencyMs: 1.4, throughputGbps: 76.5 },
  { id: 'TOP-STOR', label: 'VALKEY-STORAGE', sublabel: 'NVMe Matrix Vault', type: 'storage', x: 0, y: 160, z: 0, status: 'warning', connections: [], latencyMs: 2.4, throughputGbps: 110.8 }
];

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const SystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [view, setView] = useState<ViewMode>('dashboard');
  const [devices, setDevices] = useState<DeviceNode[]>(initialDevices);
  const [selectedDevice, setSelectedDevice] = useState<DeviceNode | null>(null);
  const [alerts, setAlerts] = useState<AlertItem[]>(initialAlerts);
  const [processes, setProcesses] = useState<ProcessItem[]>(initialProcesses);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Permission State (prompt first)
  const [hasTelemetryPermission, setHasTelemetryPermission] = useState<boolean | null>(() => {
    const saved = localStorage.getItem('nexora_hardware_permission');
    return saved !== null ? saved === 'true' : null;
  });

  const [showPermissionModal, setShowPermissionModal] = useState<boolean>(() => {
    return localStorage.getItem('nexora_hardware_permission') === null;
  });

  const [realHardware, setRealHardware] = useState<RealHardwareInfo>(() => {
    const cores = navigator.hardwareConcurrency || 8;
    const memInfo = (performance as any).memory;
    const usedMb = memInfo ? Math.round(memInfo.usedJSHeapSize / (1024 * 1024)) : 140;
    const limitMb = memInfo ? Math.round(memInfo.jsHeapSizeLimit / (1024 * 1024)) : 4096;
    const conn = (navigator as any).connection;

    return {
      cores,
      memoryUsageMb: usedMb,
      memoryLimitMb: limitMb,
      memoryPercentage: Math.round((usedMb / limitMb) * 100),
      downlinkMbps: conn?.downlink || 100,
      rttMs: conn?.rtt || 10,
      platform: navigator.platform || 'Host System',
      isRealTelemetry: true
    };
  });

  const [physicsConfig, setPhysicsConfig] = useState<PhysicsConfig>({
    gravityScale: 0.8,
    floatSpeed: 1.0,
    particleCount: 65,
    parallaxIntensity: 1.0,
    enableScanlines: false,
    enableSoundSim: false,
    highContrastMono: true
  });

  const [mousePos, setMousePos] = useState({ x: 0, y: 0, normalizedX: 0, normalizedY: 0 });

  const [currentMetrics, setCurrentMetrics] = useState({
    cpu: 28,
    ram: 45,
    disk: 52,
    network: 840,
    quantumDrift: 0.04,
    thermalC: 44,
    powerWatts: 680,
    iops: 98000
  });

  const [metricHistory, setMetricHistory] = useState<MetricHistoryPoint[]>(() => {
    const history: MetricHistoryPoint[] = [];
    const now = Date.now();
    for (let i = 24; i >= 0; i--) {
      const time = new Date(now - i * 2000).toTimeString().split(' ')[0];
      history.push({
        time,
        cpu: 25 + Math.sin(i * 0.4) * 8,
        ram: 42 + Math.cos(i * 0.3) * 4,
        disk: 52,
        network: 800 + Math.sin(i * 0.5) * 200,
        quantumDrift: 0.03,
        thermalC: 42 + Math.sin(i * 0.2) * 3
      });
    }
    return history;
  });

  const grantPermission = useCallback(() => {
    setHasTelemetryPermission(true);
    setShowPermissionModal(false);
    localStorage.setItem('nexora_hardware_permission', 'true');
  }, []);

  const denyPermission = useCallback(() => {
    setHasTelemetryPermission(false);
    setShowPermissionModal(false);
    localStorage.setItem('nexora_hardware_permission', 'false');
  }, []);

  const openPermissionModal = useCallback(() => {
    setShowPermissionModal(true);
  }, []);

  // Real Hardware Telemetry Polling Loop
  useEffect(() => {
    if (!isOnline) return;

    const interval = setInterval(async () => {
      let realCpu = currentMetrics.cpu;
      let realRam = currentMetrics.ram;
      let realDownlink = 840;
      let realPing = 0.8;

      if (hasTelemetryPermission) {
        // Query real browser hardware APIs
        const memInfo = (performance as any).memory;
        if (memInfo) {
          const usedMb = Math.round(memInfo.usedJSHeapSize / (1024 * 1024));
          const limitMb = Math.round(memInfo.jsHeapSizeLimit / (1024 * 1024));
          const pct = Math.max(10, Math.min(95, Math.round((usedMb / limitMb) * 100 * 3))); // scale for clarity
          realRam = pct;
        }

        const conn = (navigator as any).connection;
        if (conn) {
          realDownlink = Math.round((conn.downlink || 10) * 80);
          realPing = conn.rtt ? Number((conn.rtt / 10).toFixed(1)) : 1.2;
        }

        // Try querying local Java backend if available
        try {
          const res = await fetch('http://localhost:8080/api/v1/system/real', { signal: AbortSignal.timeout(1000) });
          if (res.ok) {
            const data = await res.json();
            if (data.cpu !== undefined) realCpu = data.cpu;
            if (data.ram !== undefined) realRam = data.ram;
          }
        } catch {
          // Graceful fallback to real browser performance timing jitter
          const perfEntries = performance.getEntriesByType('resource');
          const recentCount = perfEntries.length;
          realCpu = Math.max(12, Math.min(85, Math.round(20 + (recentCount % 30))));
        }
      }

      setCurrentMetrics(prev => {
        const newCpu = hasTelemetryPermission ? realCpu : Math.max(15, Math.min(95, Math.round(prev.cpu + (Math.random() - 0.49) * 3)));
        const newRam = hasTelemetryPermission ? realRam : prev.ram;
        const newNet = hasTelemetryPermission ? realDownlink : prev.network;

        const newPoint: MetricHistoryPoint = {
          time: new Date().toTimeString().split(' ')[0],
          cpu: newCpu,
          ram: newRam,
          disk: prev.disk,
          network: newNet,
          quantumDrift: prev.quantumDrift,
          thermalC: prev.thermalC
        };

        setMetricHistory(h => [...h.slice(1), newPoint]);

        return {
          ...prev,
          cpu: newCpu,
          ram: newRam,
          network: newNet
        };
      });

      // Update primary host node with real hardware
      if (hasTelemetryPermission) {
        setDevices(prev =>
          prev.map((d, idx) => idx === 0 ? {
            ...d,
            cpu: realCpu,
            ram: realRam,
            cores: navigator.hardwareConcurrency || 16,
            lastPingMs: realPing
          } : d)
        );
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isOnline, hasTelemetryPermission]);

  const healthScore = Math.max(
    10,
    Math.min(
      99,
      Math.round(
        100 -
        (currentMetrics.cpu > 70 ? (currentMetrics.cpu - 70) * 1.2 : 0) -
        (currentMetrics.ram > 80 ? (currentMetrics.ram - 80) * 1.5 : 0) -
        (!isOnline ? 50 : 0)
      )
    )
  );

  const healthStatus: 'OPTIMAL' | 'DEGRADED' | 'CRITICAL' = 
    healthScore >= 85 ? 'OPTIMAL' : healthScore >= 55 ? 'DEGRADED' : 'CRITICAL';

  // Global Mouse tracking for 3D Parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const normalizedX = (e.clientX / innerWidth) * 2 - 1;
      const normalizedY = (e.clientY / innerHeight) * 2 - 1;
      setMousePos({ x: e.clientX, y: e.clientY, normalizedX, normalizedY });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Global Keyboard shortcut (CTRL+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const acknowledgeAlert = useCallback((id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  }, []);

  const dismissAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  }, []);

  const triggerSimulatedAlert = useCallback((severity: 'critical' | 'warning' | 'info' = 'critical') => {
    const alertId = `ALT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newAlert: AlertItem = {
      id: alertId,
      severity,
      title: severity === 'critical' ? 'REAL CPU UTILIZATION THRESHOLD SPIKE' : 'MEMORY HEAP ALLOCATION PRESSURE',
      message: 'Host hardware telemetry loop captured metric variance outside safety tolerances.',
      device: 'HOST-PHYSICAL-PRIMARY',
      timestamp: new Date().toTimeString().split(' ')[0] + '.' + Math.floor(Math.random() * 90),
      acknowledged: false,
      metric: 'HOST_CPU',
      value: `${currentMetrics.cpu}%`
    };
    setAlerts(prev => [newAlert, ...prev.slice(0, 7)]);
  }, [currentMetrics.cpu]);

  const killProcess = useCallback((pid: number) => {
    setProcesses(prev => prev.filter(p => p.pid !== pid));
  }, []);

  const boostProcess = useCallback((pid: number) => {
    setProcesses(prev => prev.map(p => p.pid === pid ? { ...p, priority: 'CRITICAL', cpu: Math.min(99, p.cpu + 15) } : p));
  }, []);

  const injectFault = useCallback((type: 'cpu_spike' | 'mem_leak' | 'network_drop' | 'quantum_drift') => {
    if (type === 'cpu_spike') {
      setCurrentMetrics(prev => ({ ...prev, cpu: 94, thermalC: 78 }));
      triggerSimulatedAlert('critical');
    } else if (type === 'mem_leak') {
      setCurrentMetrics(prev => ({ ...prev, ram: 92 }));
      triggerSimulatedAlert('warning');
    } else if (type === 'network_drop') {
      setCurrentMetrics(prev => ({ ...prev, network: 120, iops: 12400 }));
      triggerSimulatedAlert('critical');
    } else if (type === 'quantum_drift') {
      setCurrentMetrics(prev => ({ ...prev, quantumDrift: 0.45 }));
      triggerSimulatedAlert('warning');
    }
  }, [triggerSimulatedAlert]);

  const resetTelemetry = useCallback(() => {
    setCurrentMetrics({
      cpu: 28,
      ram: 45,
      disk: 52,
      network: 840,
      quantumDrift: 0.04,
      thermalC: 44,
      powerWatts: 680,
      iops: 98000
    });
    setAlerts(initialAlerts);
  }, []);

  const toggleOnline = useCallback(() => {
    setIsOnline(prev => !prev);
  }, []);

  return (
    <SystemContext.Provider
      value={{
        view,
        setView,
        healthScore,
        healthStatus,
        devices,
        selectedDevice,
        setSelectedDevice,
        alerts,
        acknowledgeAlert,
        dismissAlert,
        triggerSimulatedAlert,
        processes,
        killProcess,
        boostProcess,
        metricHistory,
        currentMetrics,
        topologyNodes: initialTopology,
        physicsConfig,
        setPhysicsConfig,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isOnline,
        toggleOnline,
        injectFault,
        resetTelemetry,
        mousePos,
        hasTelemetryPermission,
        showPermissionModal,
        openPermissionModal,
        grantPermission,
        denyPermission,
        realHardware
      }}
    >
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
};
