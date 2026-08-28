package com.nexora.factory;

import com.nexora.builder.DeviceNode;
import com.nexora.state.OnlineState;
import com.nexora.state.DegradedState;

/**
 * FACTORY PATTERN: Factory for instantiating specialized Node types.
 */
public class DeviceNodeFactory {

    public static DeviceNode createHypervisor(String id, String name, String ip, String location) {
        return new DeviceNode.Builder()
                .id(id).name(name).type("hypervisor").ip(ip).location(location)
                .cores(64).frequencyGhz(4.8).cpu(38.0).ram(64.0).disk(52.0).temp(44.0)
                .networkIn(840.0).networkOut(620.0).uptime("142d 18h 22m").lastPingMs(1.2)
                .state(new OnlineState())
                .build();
    }

    public static DeviceNode createQuantumCore(String id, String name, String ip, String location) {
        return new DeviceNode.Builder()
                .id(id).name(name).type("quantum-core").ip(ip).location(location)
                .cores(128).frequencyGhz(5.6).cpu(82.0).ram(78.0).disk(31.0).temp(18.0)
                .networkIn(1420.0).networkOut(1850.0).uptime("89d 04h 11m").lastPingMs(0.4)
                .state(new OnlineState())
                .build();
    }

    public static DeviceNode createDatabaseCluster(String id, String name, String ip, String location) {
        return new DeviceNode.Builder()
                .id(id).name(name).type("database-cluster").ip(ip).location(location)
                .cores(32).frequencyGhz(4.2).cpu(45.0).ram(84.0).disk(89.0).temp(58.0)
                .networkIn(2100.0).networkOut(2400.0).uptime("310d 12h 05m").lastPingMs(2.1)
                .state(new OnlineState())
                .build();
    }

    public static DeviceNode createEdgeGateway(String id, String name, String ip, String location) {
        return new DeviceNode.Builder()
                .id(id).name(name).type("edge-gateway").ip(ip).location(location)
                .cores(16).frequencyGhz(3.9).cpu(91.0).ram(72.0).disk(44.0).temp(68.0)
                .networkIn(410.0).networkOut(390.0).uptime("14d 09h 50m").lastPingMs(12.8)
                .state(new DegradedState())
                .build();
    }

    public static DeviceNode createNeuralAccelerator(String id, String name, String ip, String location) {
        return new DeviceNode.Builder()
                .id(id).name(name).type("neural-accelerator").ip(ip).location(location)
                .cores(256).frequencyGhz(3.5).cpu(56.0).ram(48.0).disk(22.0).temp(49.0)
                .networkIn(3200.0).networkOut(3100.0).uptime("52d 16h 30m").lastPingMs(0.8)
                .state(new OnlineState())
                .build();
    }

    public static DeviceNode createStorageVault(String id, String name, String ip, String location) {
        return new DeviceNode.Builder()
                .id(id).name(name).type("storage-vault").ip(ip).location(location)
                .cores(16).frequencyGhz(2.8).cpu(18.0).ram(32.0).disk(94.0).temp(32.0)
                .networkIn(180.0).networkOut(95.0).uptime("612d 23h 01m").lastPingMs(18.4)
                .state(new OnlineState())
                .build();
    }
}
