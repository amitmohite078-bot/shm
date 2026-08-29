import React, { useState } from 'react';
import { AntigravityCard } from '../ui/AntigravityCard';
import { 
  Code2, 
  Cpu, 
  Layers, 
  Binary, 
  Database, 
  ShieldCheck, 
  Zap, 
  Terminal, 
  Activity, 
  Boxes, 
  Workflow, 
  GitBranch, 
  Server, 
  CheckCircle2, 
  Sparkles, 
  Lock, 
  Repeat, 
  Share2, 
  Sliders, 
  Radio, 
  Flame,
  FileCode2,
  ExternalLink,
  BookOpen,
  Target
} from 'lucide-react';

export const TechStackJavaConceptsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'tech' | 'java' | 'usecases'>('all');
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);

  const techStack = [
    {
      category: 'Frontend Architecture',
      items: [
        { name: 'React 18 & TypeScript', desc: 'Component lifecycle, typed contracts, React Context API, custom hooks, and concurrent rendering.', icon: Code2, tag: 'Core UI' },
        { name: 'Three.js & WebGL 3D', desc: 'Hardware-accelerated 3D quantum core viewport, matrix transformations, orbital satellites, and particle physics.', icon: Boxes, tag: '3D Graphics' },
        { name: 'Tailwind CSS & Vanilla CSS', desc: 'High-contrast monochrome HUD aesthetics, custom design tokens, scanline overlays, and responsive typography.', icon: Layers, tag: 'Styling' },
        { name: 'Browser Telemetry & Network API', desc: 'Hardware concurrency probing, JS heap inspection, live round-trip ping latency, and offline state reconciliation.', icon: Activity, tag: 'Telemetry' },
        { name: 'Vite & Modern Tooling', desc: 'Ultra-fast ES-module bundling, instant HMR, optimized production chunks, and zero-latency build pipeline.', icon: Zap, tag: 'Build' }
      ]
    },
    {
      category: 'Backend Architecture (Java & Spring Boot)',
      items: [
        { name: 'Java 17 / 21 LTS', desc: 'Strongly typed modern Java runtime with record classes, pattern matching, switch expressions, and virtual thread readiness.', icon: Binary, tag: 'Language' },
        { name: 'Spring Boot 3.x & Spring MVC', desc: 'Enterprise microservice scaffolding, dependency injection (IoC), RESTful endpoints, and CORS middleware configuration.', icon: Server, tag: 'Framework' },
        { name: 'Java Management Extensions (JMX)', desc: 'Direct kernel queries via OperatingSystemMXBean and MemoryMXBean for live CPU and physical RAM monitoring.', icon: Cpu, tag: 'System Diagnostics' },
        { name: 'Java Concurrency & Executors', desc: 'ScheduledExecutorService, thread pools, AtomicReference, and thread-safe data structures.', icon: Workflow, tag: 'Multithreading' }
      ]
    }
  ];

  const javaConcepts = [
    {
      id: 'gof-patterns',
      title: 'GoF Design Patterns Architecture',
      category: 'Software Design',
      icon: GitBranch,
      summary: '10+ Gang-of-Four Design Patterns implemented cleanly across the Nexora Java monitoring daemon.',
      patterns: [
        {
          name: 'Factory Pattern',
          file: 'DeviceNodeFactory.java',
          role: 'Encapsulates the instantiation logic of cluster nodes (Hypervisor, Cryo-Core, Storage Vault) based on node classification.',
          code: 'public static DeviceNode createNode(String type, String id, String name) {\n  return switch (type) {\n    case "hypervisor" -> new HypervisorNode(id, name);\n    case "quantum-core" -> new QuantumNode(id, name);\n    default -> new StandardNode(id, name);\n  };\n}'
        },
        {
          name: 'Singleton Pattern',
          file: 'TelemetryEngineManager.java',
          role: 'Guarantees a single, thread-safe, double-checked locked instance of the telemetry ingestion orchestrator.',
          code: 'public class TelemetryEngineManager {\n  private static volatile TelemetryEngineManager instance;\n  public static TelemetryEngineManager getInstance() {\n    if (instance == null) {\n      synchronized (TelemetryEngineManager.class) {\n        if (instance == null) instance = new TelemetryEngineManager();\n      }\n    }\n    return instance;\n  }\n}'
        },
        {
          name: 'Observer Pattern',
          file: 'TelemetrySubject.java / TelemetryObserver.java',
          role: 'Decoupled publisher-subscriber mechanism that notifies registered listeners (Alert hubs, WebSocket dispatchers) on threshold breach.',
          code: 'public void notifyObservers(AlertEvent alert) {\n  for (TelemetryObserver obs : observers) {\n    obs.onTelemetryThresholdBreach(alert);\n  }\n}'
        },
        {
          name: 'Strategy Pattern',
          file: 'HealthStrategy.java / QuantumWeightedHealthStrategy.java',
          role: 'Dynamic health score evaluation algorithms swappable at runtime depending on operating environment.',
          code: 'public interface HealthStrategy {\n  int calculateScore(int cpu, int ram, double ping, int packetLoss);\n}'
        },
        {
          name: 'Facade Pattern',
          file: 'NexoraSystemMonitoringFacade.java',
          role: 'Exposes a clean, unified, high-level API over complex telemetry sensors, clusters, and command executors.',
          code: 'public class NexoraSystemMonitoringFacade {\n  public SystemHealthReport generateFullAudit() {\n    // Aggregates JMX, Cluster, and Sensor metrics in one call\n  }\n}'
        },
        {
          name: 'Command Pattern',
          file: 'BoostProcessCommand.java / KillProcessCommand.java',
          role: 'Encapsulates process operations (boost priority, terminate PID) as first-class executable command objects with undo support.',
          code: 'public interface Command {\n  void execute();\n  void undo();\n}'
        },
        {
          name: 'State Pattern',
          file: 'OnlineState.java / DegradedState.java / OfflineState.java',
          role: 'Controls system operational behaviors and alert levels based on current connectivity and cluster health states.',
          code: 'public interface SystemState {\n  void handleTelemetry(SystemContext ctx, TelemetryPacket packet);\n}'
        },
        {
          name: 'Composite Pattern',
          file: 'SystemClusterComposite.java / ClusterNodeLeaf.java',
          role: 'Treats individual server nodes and recursive multi-datacenter clusters uniformly in a tree hierarchy.',
          code: 'public interface ClusterComponent {\n  double getAverageCpuLoad();\n  int getTotalCores();\n}'
        },
        {
          name: 'Builder Pattern',
          file: 'SystemHealthReport.java / DeviceNode.java',
          role: 'Constructs complex immutable diagnostic reports and device node configurations with fluent chaining.',
          code: 'SystemHealthReport report = new SystemHealthReport.Builder()\n  .withCpu(42)\n  .withRam(68)\n  .withStatus("OPTIMAL")\n  .build();'
        },
        {
          name: 'Adapter Pattern',
          file: 'LegacySnmpSensorAdapter.java',
          role: 'Adapts legacy SNMP sensor hardware data formats into modern JSON REST telemetry feeds without modifying legacy code.',
          code: 'public class LegacySnmpSensorAdapter implements ModernSensor {\n  private final LegacySnmpSensor legacySensor;\n  // Translates SNMP OID byte streams to ModernSensor records\n}'
        },
        {
          name: 'Decorator Pattern',
          file: 'EncryptedSensorDecorator.java',
          role: 'Wraps telemetry data streams with cryptographic encryption layers dynamically without modifying base stream logic.',
          code: 'public class EncryptedSensorDecorator extends SensorDecorator {\n  public TelemetryPacket read() {\n    return encryptPayload(super.read());\n  }\n}'
        }
      ]
    },
    {
      id: 'concurrency',
      title: 'Multithreading & Concurrency Concepts',
      category: 'Performance & Scaling',
      icon: Workflow,
      summary: 'High-throughput asynchronous telemetry ingestion, non-blocking I/O, and lock-free thread coordination.',
      details: [
        { label: 'ScheduledExecutorService', desc: 'Background cron daemon scheduling periodic host hardware sampling and cluster heartbeat checks at fixed intervals.' },
        { label: 'Thread Safety & Atomic References', desc: 'AtomicReference and AtomicInteger prevent race conditions across parallel incoming telemetry streams without heavy synchronized locks.' },
        { label: 'Concurrent Collections', desc: 'ConcurrentHashMap and CopyOnWriteArrayList ensure high-read, low-write thread safety for connected nodes and observers.' },
        { label: 'CompletableFuture Asynchrony', desc: 'Non-blocking pipeline execution allowing parallel diagnostic probing of remote nodes simultaneously.' }
      ]
    },
    {
      id: 'oop-jvm',
      title: 'Object-Oriented Programming & JVM Internals',
      category: 'Java Core',
      icon: Binary,
      summary: 'Strict adherence to SOLID principles, deep encapsulation, and direct JVM runtime introspection.',
      details: [
        { label: 'Encapsulation & Immutability', desc: 'Immutable records and final fields ensure telemetry packets cannot be modified in transit.' },
        { label: 'Polymorphism & Abstraction', desc: 'Abstract base sensor interfaces and dynamic dispatch allow transparent addition of new sensor and node types.' },
        { label: 'JVM & JMX OperatingSystemMXBean', desc: 'Accesses underlying CPU architecture, core count, available JVM heap, and host OS memory metrics directly from Java bytecode.' },
        { label: 'Java Stream API & Functional Lambdas', desc: 'Declarative filtering, mapping, and metric aggregation across cluster collections using pipeline operations.' }
      ]
    }
  ];

  const useCases = [
    {
      title: 'Autonomous Enterprise Datacenter Monitoring',
      desc: 'Provides real-time visibility across distributed physical servers, cloud instances, and edge gateways with sub-millisecond telemetry refresh.',
      icon: Server,
      highlights: ['Multi-region cluster health aggregation', 'Instant host CPU & memory diagnostics', 'Proactive fault isolation']
    },
    {
      title: 'Real-Time Hardware Fault Detection & Triage',
      desc: 'Continuously monitors thermal gradients, quantum decoherence drift, NVMe IOPS, and network degradation to trigger instant triage alerts.',
      icon: Flame,
      highlights: ['Predictive threshold alerts', 'Zero false-positive noise', 'Automated anomaly simulation & stress testing']
    },
    {
      title: 'Process Lifecycle & Priority Management',
      desc: 'Empowers systems administrators to inspect running thread trees, reallocate priority weights to critical daemons, and terminate rogue processes.',
      icon: Cpu,
      highlights: ['Command pattern execution', 'Priority boosting and PID termination', 'Thread usage telemetry']
    },
    {
      title: 'High-Availability Offline-First Resilience',
      desc: 'Seamlessly buffers telemetry during gateway disconnects and auto-reconciles historical time-series buffers upon reconnection.',
      icon: ShieldCheck,
      highlights: ['Zero data packet loss', 'Offline status banner & one-click reconnect', 'True RTT ping & jitter diagnostics']
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 select-none max-w-7xl mx-auto">
      
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]" />
            <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
              SYSTEM ARCHITECTURE & ENGINEERING MANIFEST
            </span>
          </div>
          <h1 className="text-3xl font-bold font-display text-white tracking-wide">
            TECHNOLOGIES & JAVA CONCEPTS
          </h1>
          <p className="text-xs font-mono text-neutral-400 mt-1 max-w-2xl">
            A comprehensive technical breakdown of the full-stack architecture, enterprise Java principles, GoF design patterns, and real-world use cases powering NEXORA.
          </p>
        </div>

        {/* Navigation Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-neutral-950 border border-neutral-800">
          {[
            { id: 'all', label: 'ALL OVERVIEW' },
            { id: 'tech', label: 'TECH STACK' },
            { id: 'java', label: 'JAVA CONCEPTS & PATTERNS' },
            { id: 'usecases', label: 'USE CASES & PURPOSE' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-all ${
                activeTab === tab.id
                  ? 'bg-[#00E5FF] text-black font-bold shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: TECHNOLOGIES USED */}
      {(activeTab === 'all' || activeTab === 'tech') && (
        <section className="space-y-5">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#00E5FF]" />
            <h2 className="text-lg font-bold font-display text-white uppercase tracking-wider">
              1. Technologies & Engineering Stack
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {techStack.map((category, catIdx) => (
              <AntigravityCard key={catIdx} className="space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
                  <h3 className="text-sm font-bold font-mono text-white tracking-wide flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
                    {category.category}
                  </h3>
                  <span className="text-[10px] font-mono text-neutral-400">
                    {category.items.length} MODULES
                  </span>
                </div>

                <div className="space-y-3">
                  {category.items.map((item, itemIdx) => {
                    const Icon = item.icon;
                    return (
                      <div 
                        key={itemIdx}
                        className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-[#00E5FF]/40 transition-all flex items-start gap-3"
                      >
                        <div className="p-2 rounded bg-black text-[#00E5FF] border border-neutral-800 shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-mono font-bold text-white">
                              {item.name}
                            </span>
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30">
                              {item.tag}
                            </span>
                          </div>
                          <p className="text-[11px] font-mono text-neutral-400 mt-1 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </AntigravityCard>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 2: JAVA CONCEPTS & DESIGN PATTERNS */}
      {(activeTab === 'all' || activeTab === 'java') && (
        <section className="space-y-6 pt-4">
          <div className="flex items-center gap-2">
            <Binary className="w-5 h-5 text-[#00E5FF]" />
            <h2 className="text-lg font-bold font-display text-white uppercase tracking-wider">
              2. Core Java Concepts & GoF Design Patterns
            </h2>
          </div>

          {/* GoF Pattern Grid */}
          <AntigravityCard className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
              <div>
                <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-[#00E5FF]" />
                  GANG-OF-FOUR (GoF) DESIGN PATTERNS IMPLEMENTED IN BACKEND
                </h3>
                <p className="text-xs font-mono text-neutral-400 mt-0.5">
                  Click any pattern below to inspect its architectural purpose and implementation snippet.
                </p>
              </div>
              <span className="text-[10px] font-mono text-[#00E5FF] px-2 py-1 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/30 font-bold self-start">
                11 PATTERNS ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {javaConcepts[0].patterns?.map((pattern, pIdx) => {
                const isSelected = selectedPattern === pattern.name;
                return (
                  <div
                    key={pIdx}
                    onClick={() => setSelectedPattern(isSelected ? null : pattern.name)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-neutral-900 border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                        : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-[#00E5FF]' : 'bg-neutral-500'}`} />
                        {pattern.name}
                      </span>
                      <span className="text-[9px] font-mono text-[#00E5FF]">
                        {pattern.file}
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-neutral-400 leading-normal">
                      {pattern.role}
                    </p>

                    {isSelected && (
                      <div className="mt-3 pt-2.5 border-t border-neutral-800 animate-in fade-in duration-200">
                        <div className="text-[9px] font-mono text-neutral-400 mb-1 flex items-center gap-1">
                          <FileCode2 className="w-3 h-3 text-[#00E5FF]" />
                          <span>JAVA SOURCE SIGNATURE</span>
                        </div>
                        <pre className="p-2 rounded bg-black text-[#00E5FF] text-[10px] font-mono overflow-x-auto border border-neutral-800">
                          <code>{pattern.code}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </AntigravityCard>

          {/* Multithreading, JVM, and OOP Deep Dive */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Concurrency Card */}
            <AntigravityCard className="space-y-4">
              <div className="flex items-center gap-2 border-b border-neutral-800 pb-2.5">
                <Workflow className="w-4 h-4 text-[#00E5FF]" />
                <h3 className="text-sm font-bold font-mono text-white">
                  MULTITHREADING & CONCURRENCY
                </h3>
              </div>
              <div className="space-y-2.5">
                {javaConcepts[1].details?.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
                    <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00E5FF]" />
                      {item.label}
                    </div>
                    <p className="text-[11px] font-mono text-neutral-400 mt-1">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </AntigravityCard>

            {/* OOP & JVM Architecture */}
            <AntigravityCard className="space-y-4">
              <div className="flex items-center gap-2 border-b border-neutral-800 pb-2.5">
                <Cpu className="w-4 h-4 text-[#00E5FF]" />
                <h3 className="text-sm font-bold font-mono text-white">
                  OOP PRINCIPLES & JVM ARCHITECTURE
                </h3>
              </div>
              <div className="space-y-2.5">
                {javaConcepts[2].details?.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
                    <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00E5FF]" />
                      {item.label}
                    </div>
                    <p className="text-[11px] font-mono text-neutral-400 mt-1">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </AntigravityCard>

          </div>
        </section>
      )}

      {/* SECTION 3: WHAT IS THE USE OF IT (PURPOSE & BENEFITS) */}
      {(activeTab === 'all' || activeTab === 'usecases') && (
        <section className="space-y-5 pt-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#00E5FF]" />
            <h2 className="text-lg font-bold font-display text-white uppercase tracking-wider">
              3. Purpose & Real-World Use Cases
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {useCases.map((uc, idx) => {
              const Icon = uc.icon;
              return (
                <AntigravityCard key={idx} className="space-y-4">
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-lg bg-neutral-900 text-[#00E5FF] border border-neutral-800 shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold font-display text-white tracking-wide">
                        {uc.title}
                      </h3>
                      <p className="text-xs font-mono text-neutral-400 leading-relaxed">
                        {uc.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-800 space-y-1.5">
                    <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block">
                      KEY VALUE & CAPABILITIES
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {uc.highlights.map((h, hIdx) => (
                        <span 
                          key={hIdx}
                          className="text-[10px] font-mono px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-200 flex items-center gap-1.5"
                        >
                          <span className="w-1 h-1 rounded-full bg-[#00E5FF]" />
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </AntigravityCard>
              );
            })}
          </div>
        </section>
      )}

    </div>
  );
};
