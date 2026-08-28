package com.nexora.facade;

import com.nexora.builder.DeviceNode;
import com.nexora.builder.AlertEvent;
import com.nexora.builder.SystemHealthReport;
import com.nexora.command.CommandInvoker;
import com.nexora.command.KillProcessCommand;
import com.nexora.command.BoostProcessCommand;
import com.nexora.singleton.TelemetryEngineManager;

import java.util.List;

/**
 * FACADE PATTERN: Unified high-level API orchestrating all sub-systems,
 * telemetry managers, strategies, command invokers, and factories for the client.
 */
public class NexoraSystemMonitoringFacade {
    private final TelemetryEngineManager engine;
    private final CommandInvoker commandInvoker;

    public NexoraSystemMonitoringFacade() {
        this.engine = TelemetryEngineManager.getInstance();
        this.commandInvoker = new CommandInvoker();
    }

    public SystemHealthReport getSystemHealthSnapshot() {
        int score = engine.computeHealthScore();
        String status = score >= 85 ? "OPTIMAL" : score >= 55 ? "DEGRADED" : "CRITICAL";

        return new SystemHealthReport.Builder()
                .healthScore(score)
                .status(status)
                .cpu(engine.getCurrentCpu())
                .ram(engine.getCurrentRam())
                .disk(engine.getCurrentDisk())
                .network(engine.getCurrentNetwork())
                .quantumDrift(engine.getCurrentQuantumDrift())
                .thermalC(engine.getCurrentThermalC())
                .nodes(engine.getNodes())
                .activeAlerts(engine.getAlerts())
                .build();
    }

    public List<DeviceNode> getAllNodes() {
        return engine.getNodes();
    }

    public List<AlertEvent> getAlerts() {
        return engine.getAlerts();
    }

    public String terminateProcess(int pid, String processName) {
        return commandInvoker.executeCommand(new KillProcessCommand(pid, processName));
    }

    public String elevateProcess(int pid, String processName) {
        return commandInvoker.executeCommand(new BoostProcessCommand(pid, processName));
    }

    public void injectSimulatedAnomaly(String type) {
        if ("cpu_spike".equalsIgnoreCase(type)) {
            engine.updateMetrics(94.0, 70.0, 54.0, 1420.0, 0.08, 78.0);
        } else if ("mem_leak".equalsIgnoreCase(type)) {
            engine.updateMetrics(45.0, 92.0, 54.0, 1420.0, 0.08, 52.0);
        } else if ("quantum_drift".equalsIgnoreCase(type)) {
            engine.updateMetrics(42.0, 68.0, 54.0, 1420.0, 0.45, 48.0);
        }
    }
}
