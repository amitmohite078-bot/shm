package com.nexora.strategy;

import com.nexora.builder.DeviceNode;
import com.nexora.builder.AlertEvent;
import java.util.List;

public class QuantumWeightedHealthStrategy implements HealthScoreStrategy {
    @Override
    public int calculateScore(double cpu, double ram, double thermalC, List<AlertEvent> alerts, List<DeviceNode> nodes) {
        double score = 100.0;
        // Exponential penalty for high thermal drift
        if (thermalC > 50) score -= Math.pow((thermalC - 50) / 5.0, 1.5);
        if (cpu > 60) score -= (cpu - 60) * 1.5;
        if (ram > 75) score -= (ram - 75) * 1.8;

        if (nodes != null) {
            long offlineCount = nodes.stream().filter(n -> "offline".equalsIgnoreCase(n.getStatus())).count();
            score -= (offlineCount * 20);
        }
        return Math.max(5, Math.min(99, (int) Math.round(score)));
    }
}
