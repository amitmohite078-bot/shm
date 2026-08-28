package com.nexora.singleton;

import com.nexora.builder.DeviceNode;
import com.nexora.builder.AlertEvent;
import com.nexora.factory.DeviceNodeFactory;
import com.nexora.observer.TelemetrySubject;
import com.nexora.strategy.HealthScoreStrategy;
import com.nexora.strategy.StandardHealthStrategy;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

/**
 * SINGLETON PATTERN: Thread-safe double-checked locking singleton instance
 * orchestrating the telemetry background worker and real-time state.
 */
public class TelemetryEngineManager {
    private static volatile TelemetryEngineManager instance;

    private final TelemetrySubject telemetrySubject;
    private final List<DeviceNode> nodes;
    private final List<AlertEvent> alerts;
    private HealthScoreStrategy healthStrategy;

    private double currentCpu = 42.0;
    private double currentRam = 68.0;
    private double currentDisk = 54.0;
    private double currentNetwork = 1420.0;
    private double currentQuantumDrift = 0.08;
    private double currentThermalC = 48.0;

    private TelemetryEngineManager() {
        this.telemetrySubject = new TelemetrySubject();
        this.nodes = new CopyOnWriteArrayList<>();
        this.alerts = new CopyOnWriteArrayList<>();
        this.healthStrategy = new StandardHealthStrategy();

        // Seed initial nodes via Factory Pattern
        nodes.add(DeviceNodeFactory.createHypervisor("NODE-CORE-01", "HYPERVISOR-ALPHA-01", "10.204.0.12", "Sector 7 / Orbital Relay"));
        nodes.add(DeviceNodeFactory.createQuantumCore("NODE-QUANTUM-04", "QPU-DEEPTHOUGHT-04", "10.204.1.88", "Cryo-Chamber A / Earth Primary"));
        nodes.add(DeviceNodeFactory.createDatabaseCluster("NODE-DB-CLUSTER", "VALKEY-VAULT-MATRIX", "10.204.4.15", "Underground Vault / Zurich"));
        nodes.add(DeviceNodeFactory.createEdgeGateway("NODE-EDGE-09", "EDGE-NEURAL-GATEWAY-09", "10.204.8.44", "Lunar Base Station 3"));
        nodes.add(DeviceNodeFactory.createNeuralAccelerator("NODE-AI-ACCEL", "SYNAPSE-TENSOR-ARRAY", "10.204.12.02", "Tokyo Deep Array"));
        nodes.add(DeviceNodeFactory.createStorageVault("NODE-VAULT-07", "IMMUTABLE-LEDGER-STORAGE", "10.204.9.99", "Svalbard Arctic Seed Vault"));

        // Seed initial alerts via Builder Pattern
        alerts.add(new AlertEvent.Builder()
                .id("ALT-8891")
                .severity("critical")
                .title("NEURAL CONGESTION DETECTED")
                .message("Tensor pipe buffer utilization exceeded 94.2% threshold on EDGE-GATEWAY-09.")
                .device("EDGE-NEURAL-GATEWAY-09")
                .timestamp(LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss.SS")))
                .metric("BUFFER_PRESSURE")
                .value("94.2%")
                .build());

        alerts.add(new AlertEvent.Builder()
                .id("ALT-8890")
                .severity("warning")
                .title("NVMe THERMAL DRIFT")
                .message("Primary NVMe storage cluster approaching 68°C upper ceiling.")
                .device("VALKEY-VAULT-MATRIX")
                .timestamp(LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss.SS")))
                .metric("THERMAL_C")
                .value("68°C")
                .build());
    }

    public static TelemetryEngineManager getInstance() {
        if (instance == null) {
            synchronized (TelemetryEngineManager.class) {
                if (instance == null) {
                    instance = new TelemetryEngineManager();
                }
            }
        }
        return instance;
    }

    public TelemetrySubject getTelemetrySubject() { return telemetrySubject; }
    public List<DeviceNode> getNodes() { return nodes; }
    public List<AlertEvent> getAlerts() { return alerts; }

    public void setHealthStrategy(HealthScoreStrategy strategy) {
        this.healthStrategy = strategy;
    }

    public int computeHealthScore() {
        return healthStrategy.calculateScore(currentCpu, currentRam, currentThermalC, alerts, nodes);
    }

    public void updateMetrics(double cpu, double ram, double disk, double net, double drift, double temp) {
        this.currentCpu = cpu;
        this.currentRam = ram;
        this.currentDisk = disk;
        this.currentNetwork = net;
        this.currentQuantumDrift = drift;
        this.currentThermalC = temp;
        telemetrySubject.notifyMetrics(cpu, ram, disk, net, temp);
    }

    public double getCurrentCpu() { return currentCpu; }
    public double getCurrentRam() { return currentRam; }
    public double getCurrentDisk() { return currentDisk; }
    public double getCurrentNetwork() { return currentNetwork; }
    public double getCurrentQuantumDrift() { return currentQuantumDrift; }
    public double getCurrentThermalC() { return currentThermalC; }
}
