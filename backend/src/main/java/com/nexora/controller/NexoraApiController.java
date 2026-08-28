package com.nexora.controller;

import com.nexora.builder.DeviceNode;
import com.nexora.builder.AlertEvent;
import com.nexora.builder.SystemHealthReport;
import com.nexora.facade.NexoraSystemMonitoringFacade;
import com.nexora.service.RealHostTelemetryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class NexoraApiController {

    private final NexoraSystemMonitoringFacade facade = new NexoraSystemMonitoringFacade();
    private final RealHostTelemetryService realHostService = new RealHostTelemetryService();

    @GetMapping("/system/real")
    public Map<String, Object> getRealSystemTelemetry() {
        return realHostService.captureRealHostMetrics();
    }

    @GetMapping("/health")
    public SystemHealthReport getHealth() {
        return facade.getSystemHealthSnapshot();
    }

    @GetMapping("/nodes")
    public List<DeviceNode> getNodes() {
        return facade.getAllNodes();
    }

    @GetMapping("/alerts")
    public List<AlertEvent> getAlerts() {
        return facade.getAlerts();
    }

    @PostMapping("/process/kill")
    public Map<String, String> killProcess(@RequestParam int pid, @RequestParam String name) {
        String res = facade.terminateProcess(pid, name);
        return Map.of("status", "SUCCESS", "message", res);
    }

    @PostMapping("/process/boost")
    public Map<String, String> boostProcess(@RequestParam int pid, @RequestParam String name) {
        String res = facade.elevateProcess(pid, name);
        return Map.of("status", "SUCCESS", "message", res);
    }

    @PostMapping("/simulate")
    public Map<String, String> simulateAnomaly(@RequestParam String type) {
        facade.injectSimulatedAnomaly(type);
        return Map.of("status", "INJECTED", "type", type);
    }
}
