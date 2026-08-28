package com.nexora.builder;

import java.util.List;

/**
 * BUILDER PATTERN: Consolidated composite health snapshot report.
 */
public class SystemHealthReport {
    private final int healthScore;
    private final String status;
    private final double cpu;
    private final double ram;
    private final double disk;
    private final double network;
    private final double quantumDrift;
    private final double thermalC;
    private final List<DeviceNode> nodes;
    private final List<AlertEvent> activeAlerts;

    public SystemHealthReport(Builder builder) {
        this.healthScore = builder.healthScore;
        this.status = builder.status;
        this.cpu = builder.cpu;
        this.ram = builder.ram;
        this.disk = builder.disk;
        this.network = builder.network;
        this.quantumDrift = builder.quantumDrift;
        this.thermalC = builder.thermalC;
        this.nodes = builder.nodes;
        this.activeAlerts = builder.activeAlerts;
    }

    public static class Builder {
        private int healthScore = 100;
        private String status = "OPTIMAL";
        private double cpu;
        private double ram;
        private double disk;
        private double network;
        private double quantumDrift;
        private double thermalC;
        private List<DeviceNode> nodes;
        private List<AlertEvent> activeAlerts;

        public Builder healthScore(int healthScore) { this.healthScore = healthScore; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder cpu(double cpu) { this.cpu = cpu; return this; }
        public Builder ram(double ram) { this.ram = ram; return this; }
        public Builder disk(double disk) { this.disk = disk; return this; }
        public Builder network(double network) { this.network = network; return this; }
        public Builder quantumDrift(double quantumDrift) { this.quantumDrift = quantumDrift; return this; }
        public Builder thermalC(double thermalC) { this.thermalC = thermalC; return this; }
        public Builder nodes(List<DeviceNode> nodes) { this.nodes = nodes; return this; }
        public Builder activeAlerts(List<AlertEvent> activeAlerts) { this.activeAlerts = activeAlerts; return this; }

        public SystemHealthReport build() {
            return new SystemHealthReport(this);
        }
    }

    public int getHealthScore() { return healthScore; }
    public String getStatus() { return status; }
    public double getCpu() { return cpu; }
    public double getRam() { return ram; }
    public double getDisk() { return disk; }
    public double getNetwork() { return network; }
    public double getQuantumDrift() { return quantumDrift; }
    public double getThermalC() { return thermalC; }
    public List<DeviceNode> getNodes() { return nodes; }
    public List<AlertEvent> getActiveAlerts() { return activeAlerts; }
}
