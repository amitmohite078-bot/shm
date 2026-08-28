package com.nexora.observer;

import com.nexora.builder.AlertEvent;

/**
 * OBSERVER PATTERN: Interface for subscribing to real-time telemetry updates.
 */
public interface TelemetryObserver {
    void onMetricUpdate(double cpu, double ram, double disk, double network, double thermalC);
    void onAlertTriggered(AlertEvent alert);
}
