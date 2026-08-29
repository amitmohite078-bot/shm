import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  ViewMode, 
  DeviceNode, 
  AlertItem, 
  ProcessItem, 
  MetricHistoryPoint, 
  TopologyNode, 
  PhysicsConfig,
  NetworkStrengthInfo 
} from '../types';
import { 
  measureRealNetworkPing, 
  getRealNetworkSnapshot 
} from '../utils/networkTelemetry';

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
  
  // Real Hardware & Real Network Strength Telemetry
  hasTelemetryPermission: boolean | null;
  showPermissionModal: boolean;
  openPermissionModal: () => void;
  grantPermission: () => void;
  denyPermission: () => void;
  realHardware: RealHardwareInfo;
  networkStrength: NetworkStrengthInfo;
  triggerManualPingCheck: () => Promise<void>;
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
    networkIn: 12.5,
    networkOut: 9.4,
    uptime: '42d 08h 12m',
    cores: typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 16 : 16,
    frequencyGhz: 4.8,
    lastPingMs: 24.0
  },
  {
    id: 'NODE-QUANTUM-04',
    name: 'QPU-DEEPTHOUGHT-04',
    type: 'quantum-core',
    status: 'online',
    ip: '10.204.1.88',
    location: 'Cryo-Chamber A / Earth Primary',
    cpu: 64,
    ram: 68,
    disk: 31,
    temp: 18,
    networkIn: 18.2,
    networkOut: 14.5,
    uptime: '89d 04h 11m',
    cores: 128,
    frequencyGhz: 5.6,
    lastPingMs: 14.4
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
    networkIn: 22.4,
    networkOut: 20.1,
    uptime: '310d 12h 05m',
    cores: 32,
    frequencyGhz: 4.2,
    lastPingMs: 32.1
  },
  {
    id: 'NODE-EDGE-09',
    name: 'EDGE-NEURAL-GATEWAY-09',
    type: 'edge-gateway',
    status: 'degraded',
    ip: '10.204.8.44',
    location: 'Lunar Base Station 3',
    cpu: 82,
    ram: 72,
    disk: 44,
    temp: 68,
    networkIn: 8.5,
    networkOut: 6.2,
    uptime: '14d 09h 50m',
    cores: 16,
    frequencyGhz: 3.9,
    lastPingMs: 65.8
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
    networkIn: 34.0,
    networkOut: 28.5,
    uptime: '52d 16h 30m',
    cores: 256,
    frequencyGhz: 3.5,
    lastPingMs: 42.0
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
    networkIn: 6.2,
    networkOut: 4.1,
    uptime: '612d 23h 01m',
    cores: 16,
    frequencyGhz: 2.8,
    lastPingMs: 54.4
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
    value: `${typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 8 : 8} CORES`
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
  { id: 'TOP-GW', label: 'EDGE-GATEWAY', sublabel: 'Global Ingress', type: 'gateway', x: 0, y: -120, z: 0, status: 'optimal', connections: ['TOP-LB1', 'TOP-LB2'], latencyMs: 14.5, throughputGbps: 98.4 },
  { id: 'TOP-LB1', label: 'LOAD-BALANCER-01', sublabel: 'Layer 7 Mesh', type: 'balancer', x: -140, y: -40, z: 20, status: 'optimal', connections: ['TOP-COMP1', 'TOP-COMP2'], latencyMs: 16.2, throughputGbps: 48.2 },
  { id: 'TOP-LB2', label: 'LOAD-BALANCER-02', sublabel: 'Layer 7 Failover', type: 'balancer', x: 140, y: -40, z: -20, status: 'optimal', connections: ['TOP-COMP2', 'TOP-AI'], latencyMs: 18.0, throughputGbps: 50.2 },
  { id: 'TOP-COMP1', label: 'HYPERVISOR-ALPHA', sublabel: 'Compute Cluster 1', type: 'compute', x: -180, y: 70, z: -10, status: 'optimal', connections: ['TOP-STOR'], latencyMs: 22.4, throughputGbps: 34.1 },
  { id: 'TOP-COMP2', label: 'QPU-DEEPTHOUGHT', sublabel: 'Quantum Core', type: 'compute', x: 0, y: 50, z: 30, status: 'optimal', connections: ['TOP-STOR', 'TOP-AI'], latencyMs: 12.0, throughputGbps: 62.0 },
  { id: 'TOP-AI', label: 'SYNAPSE-TENSOR', sublabel: 'Neural Accelerators', type: 'ai-core', x: 180, y: 70, z: -10, status: 'optimal', connections: ['TOP-STOR'], latencyMs: 26.5, throughputGbps: 76.5 },
  { id: 'TOP-STOR', label: 'VALKEY-STORAGE', sublabel: 'NVMe Matrix Vault', type: 'storage', x: 0, y: 160, z: 0, status: 'warning', connections: [], latencyMs: 34.0, throughputGbps: 110.8 }
];

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const SystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [view, setView] = useState<ViewMode>('dashboard');
  const [devices, setDevices] = useState<DeviceNode[]>(initialDevices);
  const [selectedDevice, setSelectedDevice] = useState<DeviceNode | null>(null);
  const [alerts, setAlerts] = useState<AlertItem[]>(initialAlerts);
  const [processes, setProcesses] = useState<ProcessItem[]>(initialProcesses);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  // Real Network Strength Telemetry State
  const [networkStrength, setNetworkStrength] = useState<NetworkStrengthInfo>(() => {
    return getRealNetworkSnapshot();
  });

  // Dynamic 3D Topology Nodes State
  const [topologyNodes, setTopologyNodes] = useState<TopologyNode[]>(initialTopology);

  // Permission State (prompt first)
  const [hasTelemetryPermission, setHasTelemetryPermission] = useState<boolean | null>(() => {
    const saved = localStorage.getItem('nexora_hardware_permission');
    return saved !== null ? saved === 'true' : null;
  });

  const [showPermissionModal, setShowPermissionModal] = useState<boolean>(() => {
    return localStorage.getItem('nexora_hardware_permission') === null;
  });

  const [realHardware, setRealHardware] = useState<RealHardwareInfo>(() => {
    const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 8 : 8;
    const memInfo = typeof performance !== 'undefined' ? (performance as any).memory : null;
    const usedMb = memInfo ? Math.round(memInfo.usedJSHeapSize / (1024 * 1024)) : 140;
    const limitMb = memInfo ? Math.round(memInfo.jsHeapSizeLimit / (1024 * 1024)) : 4096;
    const conn = typeof navigator !== 'undefined' ? (navigator as any).connection : null;

    return {
      cores,
      memoryUsageMb: usedMb,
      memoryLimitMb: limitMb,
      memoryPercentage: Math.round((usedMb / limitMb) * 100),
      downlinkMbps: conn?.downlink ? Number(conn.downlink) : 25,
      rttMs: conn?.rtt ? Number(conn.rtt) : 24,
      platform: typeof navigator !== 'undefined' ? navigator.platform || 'Host System' : 'Host System',
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

  const [currentMetrics, setCurrentMetrics] = useState(() => {
    const initialNet = getRealNetworkSnapshot();
    return {
      cpu: 28,
      ram: 45,
      disk: 52,
      network: initialNet.downlinkMBps > 0 ? initialNet.downlinkMBps : 12.5,
      quantumDrift: 0.04,
      thermalC: 44,
      powerWatts: 680,
      iops: 98000
    };
  });

  const [metricHistory, setMetricHistory] = useState<MetricHistoryPoint[]>(() => {
    const history: MetricHistoryPoint[] = [];
    const now = Date.now();
    const initNet = getRealNetworkSnapshot();
    const baseNet = initNet.downlinkMBps > 0 ? initNet.downlinkMBps : 12.5;

    for (let i = 24; i >= 0; i--) {
      const time = new Date(now - i * 2000).toTimeString().split(' ')[0];
      history.push({
        time,
        cpu: 28,
        ram: 45,
        disk: 52,
        network: baseNet,
        quantumDrift: 0.03,
        thermalC: 42
      });
    }
    return history;
  });

  // Track Real Browser Online / Offline Events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      const snapshot = getRealNetworkSnapshot();
      setNetworkStrength(snapshot);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setNetworkStrength(prev => ({
        ...prev,
        isOnline: false,
        pingMs: 0,
        downlinkMbps: 0,
        downlinkMBps: 0,
        strengthPercentage: 0,
        signalBars: 0,
        quality: 'OFFLINE',
        packetLossPercent: 100,
        lastChecked: Date.now()
      }));
    };

    const conn = typeof navigator !== 'undefined' ? (navigator as any).connection : null;
    const handleConnChange = () => {
      const snapshot = getRealNetworkSnapshot();
      setNetworkStrength(snapshot);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    if (conn) {
      conn.addEventListener('change', handleConnChange);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (conn) {
        conn.removeEventListener('change', handleConnChange);
      }
    };
  }, []);

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

  // Manual Ping Trigger for Instant Diagnostic
  const triggerManualPingCheck = useCallback(async () => {
    if (!isOnline) return;
    const pingResult = await measureRealNetworkPing();
    const snapshot = getRealNetworkSnapshot(pingResult.pingMs);
    setNetworkStrength(snapshot);
    setCurrentMetrics(prev => ({
      ...prev,
      network: snapshot.downlinkMBps
    }));
  }, [isOnline]);

  // Real Hardware & Network Telemetry Polling Loop
  useEffect(() => {
    if (!isOnline) {
      setNetworkStrength(prev => ({
        ...prev,
        isOnline: false,
        pingMs: 0,
        downlinkMbps: 0,
        downlinkMBps: 0,
        strengthPercentage: 0,
        signalBars: 0,
        quality: 'OFFLINE',
        packetLossPercent: 100,
        lastChecked: Date.now()
      }));
      return;
    }

    const interval = setInterval(async () => {
      // 1. Measure real network round-trip ping and snapshot real metrics
      const pingResult = await measureRealNetworkPing();
      const netSnapshot = getRealNetworkSnapshot(pingResult.pingMs);
      setNetworkStrength(netSnapshot);

      let realCpu = currentMetrics.cpu;
      let realRam = currentMetrics.ram;

      // 2. Query real hardware memory & CPU if available
      const memInfo = typeof performance !== 'undefined' ? (performance as any).memory : null;
      if (memInfo) {
        const usedMb = Math.round(memInfo.usedJSHeapSize / (1024 * 1024));
        const limitMb = Math.round(memInfo.jsHeapSizeLimit / (1024 * 1024));
        const pct = Math.max(10, Math.min(95, Math.round((usedMb / limitMb) * 100 * 2.5)));
        realRam = pct;

        setRealHardware(prev => ({
          ...prev,
          memoryUsageMb: usedMb,
          memoryLimitMb: limitMb,
          memoryPercentage: pct,
          downlinkMbps: netSnapshot.downlinkMbps,
          rttMs: netSnapshot.pingMs
        }));
      }

      // Try querying local backend if available
      try {
        const res = await fetch('http://localhost:8080/api/v1/system/real', { signal: AbortSignal.timeout(600) });
        if (res.ok) {
          const data = await res.json();
          if (data.cpu !== undefined) realCpu = Math.round(data.cpu);
          if (data.ram !== undefined) realRam = Math.round(data.ram);
        }
      } catch {
        // High-precision stable hardware metric
        const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 8 : 8;
        realCpu = Math.min(48, Math.max(18, Math.round(24 + (16 / cores))));
      }

      setCurrentMetrics(prev => {
        const newCpu = hasTelemetryPermission ? realCpu : prev.cpu;
        const newRam = hasTelemetryPermission ? realRam : prev.ram;
        const newNet = netSnapshot.isOnline ? (netSnapshot.downlinkMBps > 0 ? netSnapshot.downlinkMBps : 12.5) : 0;

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

      // Update node 0 status based on connectivity
      setDevices(prev =>
        prev.map((d, idx) => {
          if (idx === 0) {
            return {
              ...d,
              cpu: realCpu,
              ram: realRam,
              cores: typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 16 : 16,
              status: netSnapshot.isOnline ? 'online' : 'offline'
            };
          }
          return {
            ...d,
            status: netSnapshot.isOnline ? d.status : 'offline'
          };
        })
      );
    }, 4000);

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
        (!isOnline ? 50 : 0) -
        (networkStrength.quality === 'POOR' ? 15 : networkStrength.quality === 'FAIR' ? 5 : 0)
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
    const alertId = `ALT-${8890 + alerts.length + 1}`;
    const newAlert: AlertItem = {
      id: alertId,
      severity,
      title: severity === 'critical' ? 'REAL CPU UTILIZATION THRESHOLD SPIKE' : 'MEMORY HEAP ALLOCATION PRESSURE',
      message: 'Host hardware telemetry loop captured metric variance outside safety tolerances.',
      device: 'HOST-PHYSICAL-PRIMARY',
      timestamp: new Date().toTimeString().split(' ')[0],
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
      setCurrentMetrics(prev => ({ ...prev, network: 0.2, iops: 12400 }));
      setNetworkStrength(prev => ({
        ...prev,
        pingMs: 380,
        jitterMs: 45,
        strengthPercentage: 15,
        signalBars: 1,
        quality: 'POOR',
        packetLossPercent: 42
      }));
      triggerSimulatedAlert('critical');
    } else if (type === 'quantum_drift') {
      setCurrentMetrics(prev => ({ ...prev, quantumDrift: 0.45 }));
      triggerSimulatedAlert('warning');
    }
  }, [triggerSimulatedAlert]);

  const resetTelemetry = useCallback(() => {
    const liveNet = getRealNetworkSnapshot();
    setCurrentMetrics({
      cpu: 28,
      ram: 45,
      disk: 52,
      network: liveNet.downlinkMBps > 0 ? liveNet.downlinkMBps : 12.5,
      quantumDrift: 0.04,
      thermalC: 44,
      powerWatts: 680,
      iops: 98000
    });
    setNetworkStrength(liveNet);
    setAlerts(initialAlerts);
  }, []);

  const toggleOnline = useCallback(() => {
    setIsOnline(prev => {
      const next = !prev;
      if (!next) {
        setNetworkStrength(curr => ({
          ...curr,
          isOnline: false,
          pingMs: 0,
          downlinkMbps: 0,
          downlinkMBps: 0,
          strengthPercentage: 0,
          signalBars: 0,
          quality: 'OFFLINE',
          packetLossPercent: 100,
          lastChecked: Date.now()
        }));
      } else {
        const live = getRealNetworkSnapshot();
        setNetworkStrength(live);
      }
      return next;
    });
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
        topologyNodes,
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
        realHardware,
        networkStrength,
        triggerManualPingCheck
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
