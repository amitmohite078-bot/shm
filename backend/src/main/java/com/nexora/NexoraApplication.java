package com.nexora;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class NexoraApplication {
    public static void main(String[] args) {
        SpringApplication.run(NexoraApplication.class, args);
        System.out.println(">>> NEXORA 2035 // Telemetry Backend Running with all GoF Design Patterns <<<");
    }
}
