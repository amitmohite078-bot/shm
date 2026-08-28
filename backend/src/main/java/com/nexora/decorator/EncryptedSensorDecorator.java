package com.nexora.decorator;

public class EncryptedSensorDecorator implements SensorStream {
    private final SensorStream wrapped;

    public EncryptedSensorDecorator(SensorStream wrapped) {
        this.wrapped = wrapped;
    }

    @Override
    public String readRawTelemetry() {
        return "KYBER1024_ENCRYPTED(" + wrapped.readRawTelemetry() + ")";
    }
}
