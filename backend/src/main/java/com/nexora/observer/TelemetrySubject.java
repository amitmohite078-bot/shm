package com.nexora.observer;

import com.nexora.builder.AlertEvent;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * OBSERVER PATTERN: Subject managing telemetry stream subscribers.
 */
public class TelemetrySubject {
    private final List<TelemetryObserver> observers = new CopyOnWriteArrayList<>();

    public void registerObserver(TelemetryObserver observer) {
        observers.add(observer);
    }

    public void unregisterObserver(TelemetryObserver observer) {
        observers.remove(observer);
    }

    public void notifyMetrics(double cpu, double ram, double disk, double network, double thermalC) {
        for (TelemetryObserver obs : observers) {
            obs.onMetricUpdate(cpu, ram, disk, network, thermalC);
        }
    }

    public void notifyAlert(AlertEvent alert) {
        for (TelemetryObserver obs : observers) {
            obs.onAlertTriggered(alert);
        }
    }
}
