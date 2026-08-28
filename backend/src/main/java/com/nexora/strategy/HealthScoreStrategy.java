package com.nexora.strategy;

import com.nexora.builder.DeviceNode;
import com.nexora.builder.AlertEvent;
import java.util.List;

/**
 * STRATEGY PATTERN: Interface for pluggable composite health score algorithms.
 */
public interface HealthScoreStrategy {
    int calculateScore(double cpu, double ram, double thermalC, List<AlertEvent> alerts, List<DeviceNode> nodes);
}
