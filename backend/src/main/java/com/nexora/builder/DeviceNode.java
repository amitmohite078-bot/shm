package com.nexora.builder;

import com.nexora.state.NodeState;
import com.nexora.state.OnlineState;
import com.nexora.state.DegradedState;
import com.nexora.state.OfflineState;

/**
 * BUILDER PATTERN: DeviceNode constructed via fluent Builder.
 * Also integrates STATE PATTERN for runtime status management.
 */
public class DeviceNode {
    private final String id;
    private final String name;
    private final String type;
    private NodeState state;
    private final String ip;
    private final String location;
    private double cpu;
    private double ram;
    private double disk;
    private double temp;
    private double networkIn;
    private double networkOut;
    private final String uptime;
    private final int cores;
    private final double frequencyGhz;
    private double lastPingMs;

    private DeviceNode(Builder builder) {
        this.id = builder.id;
        this.name = builder.name;
        this.type = builder.type;
        this.state = builder.state;
        this.ip = builder.ip;
        this.location = builder.location;
        this.cpu = builder.cpu;
        this.ram = builder.ram;
        this.disk = builder.disk;
        this.temp = builder.temp;
        this.networkIn = builder.networkIn;
        this.networkOut = builder.networkOut;
        this.uptime = builder.uptime;
        this.cores = builder.cores;
        this.frequencyGhz = builder.frequencyGhz;
        this.lastPingMs = builder.lastPingMs;
    }

    public static class Builder {
        private String id;
        private String name;
        private String type;
        private NodeState state = new OnlineState();
        private String ip = "127.0.0.1";
        private String location = "Primary Data Center";
        private double cpu = 0.0;
        private double ram = 0.0;
        private double disk = 0.0;
        private double temp = 35.0;
        private double networkIn = 100.0;
        private double networkOut = 100.0;
        private String uptime = "0d 0h";
        private int cores = 16;
        private double frequencyGhz = 3.5;
        private double lastPingMs = 1.0;

        public Builder id(String id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder type(String type) { this.type = type; return this; }
        public Builder state(NodeState state) { this.state = state; return this; }
        public Builder ip(String ip) { this.ip = ip; return this; }
        public Builder location(String location) { this.location = location; return this; }
        public Builder cpu(double cpu) { this.cpu = cpu; return this; }
        public Builder ram(double ram) { this.ram = ram; return this; }
        public Builder disk(double disk) { this.disk = disk; return this; }
        public Builder temp(double temp) { this.temp = temp; return this; }
        public Builder networkIn(double networkIn) { this.networkIn = networkIn; return this; }
        public Builder networkOut(double networkOut) { this.networkOut = networkOut; return this; }
        public Builder uptime(String uptime) { this.uptime = uptime; return this; }
        public Builder cores(int cores) { this.cores = cores; return this; }
        public Builder frequencyGhz(double frequencyGhz) { this.frequencyGhz = frequencyGhz; return this; }
        public Builder lastPingMs(double lastPingMs) { this.lastPingMs = lastPingMs; return this; }

        public DeviceNode build() {
            return new DeviceNode(this);
        }
    }

    // State pattern transitions
    public void setState(NodeState state) { this.state = state; }
    public NodeState getState() { return state; }
    public String getStatus() { return state.getStatusName(); }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getType() { return type; }
    public String getIp() { return ip; }
    public String getLocation() { return location; }
    public double getCpu() { return cpu; }
    public void setCpu(double cpu) { this.cpu = cpu; }
    public double getRam() { return ram; }
    public void setRam(double ram) { this.ram = ram; }
    public double getDisk() { return disk; }
    public void setDisk(double disk) { this.disk = disk; }
    public double getTemp() { return temp; }
    public void setTemp(double temp) { this.temp = temp; }
    public double getNetworkIn() { return networkIn; }
    public double getNetworkOut() { return networkOut; }
    public String getUptime() { return uptime; }
    public int getCores() { return cores; }
    public double getFrequencyGhz() { return frequencyGhz; }
    public double getLastPingMs() { return lastPingMs; }
    public void setLastPingMs(double lastPingMs) { this.lastPingMs = lastPingMs; }
}
