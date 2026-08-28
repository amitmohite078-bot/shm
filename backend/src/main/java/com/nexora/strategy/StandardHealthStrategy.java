package com.nexora.strategy;

import com.nexora.builder.DeviceNode;
import com.nexora.builder.AlertEvent;
import java.util.List;

public class StandardHealthStrategy implements HealthScoreStrategy {
    @Override
    public int calculateScore(double cpu, double ram, double thermalC, List<AlertEvent> alerts, List<DeviceNode> nodes) {
        double score = 100.0;
        if (cpu > 70) score -= (cpu - 70) * 1.2;
        if (ram > 80) score -= (ram - 80) * 1.5;
        if (thermalC > 60) score -= (thermalC - 60) * 1.8;

        if (alerts != null) {
            for (AlertEvent alert : alerts) {
                if (!alert.isAcknowledged()) {
                    if ("critical".equalsIgnoreCase(alert.getSeverity())) score -= 10;
                    else if ("warning".equalsIgnoreCase(alert.getSeverity())) score -= 4;
                }
            }
        }
        return Math.max(10, Math.min(99, (int) Math.round(score)));
    }
}
