package com.nexora.builder;

/**
 * BUILDER PATTERN: AlertEvent representing high-contrast threat notifications.
 */
public class AlertEvent {
    private final String id;
    private final String severity; // "critical", "warning", "info"
    private final String title;
    private final String message;
    private final String device;
    private final String timestamp;
    private boolean acknowledged;
    private final String metric;
    private final String value;

    private AlertEvent(Builder builder) {
        this.id = builder.id;
        this.severity = builder.severity;
        this.title = builder.title;
        this.message = builder.message;
        this.device = builder.device;
        this.timestamp = builder.timestamp;
        this.acknowledged = builder.acknowledged;
        this.metric = builder.metric;
        this.value = builder.value;
    }

    public static class Builder {
        private String id;
        private String severity = "info";
        private String title;
        private String message;
        private String device = "CLUSTER-CORE";
        private String timestamp;
        private boolean acknowledged = false;
        private String metric;
        private String value;

        public Builder id(String id) { this.id = id; return this; }
        public Builder severity(String severity) { this.severity = severity; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder message(String message) { this.message = message; return this; }
        public Builder device(String device) { this.device = device; return this; }
        public Builder timestamp(String timestamp) { this.timestamp = timestamp; return this; }
        public Builder acknowledged(boolean acknowledged) { this.acknowledged = acknowledged; return this; }
        public Builder metric(String metric) { this.metric = metric; return this; }
        public Builder value(String value) { this.value = value; return this; }

        public AlertEvent build() {
            return new AlertEvent(this);
        }
    }

    public String getId() { return id; }
    public String getSeverity() { return severity; }
    public String getTitle() { return title; }
    public String getMessage() { return message; }
    public String getDevice() { return device; }
    public String getTimestamp() { return timestamp; }
    public boolean isAcknowledged() { return acknowledged; }
    public void setAcknowledged(boolean acknowledged) { this.acknowledged = acknowledged; }
    public String getMetric() { return metric; }
    public String getValue() { return value; }
}
