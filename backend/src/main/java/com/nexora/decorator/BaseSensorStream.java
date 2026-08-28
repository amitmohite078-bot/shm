package com.nexora.decorator;

public class BaseSensorStream implements SensorStream {
    private final String sensorId;

    public BaseSensorStream(String sensorId) {
        this.sensorId = sensorId;
    }

    @Override
    public String readRawTelemetry() {
        return "SENSOR_PAYLOAD[" + sensorId + "]: OK";
    }
}
