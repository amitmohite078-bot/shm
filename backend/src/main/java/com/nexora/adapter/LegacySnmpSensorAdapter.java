package com.nexora.adapter;

import com.nexora.decorator.SensorStream;

public class LegacySnmpSensorAdapter implements SensorStream {
    private final LegacySnmpSensor legacySensor;
    private final String oid;

    public LegacySnmpSensorAdapter(LegacySnmpSensor legacySensor, String oid) {
        this.legacySensor = legacySensor;
        this.oid = oid;
    }

    @Override
    public String readRawTelemetry() {
        return "ADAPTED_TELEMETRY(" + legacySensor.fetchOidValues(oid) + ")";
    }
}
