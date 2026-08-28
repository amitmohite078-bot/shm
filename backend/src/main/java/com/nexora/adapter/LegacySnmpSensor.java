package com.nexora.adapter;

import com.nexora.decorator.SensorStream;

/**
 * ADAPTER PATTERN: Adapts legacy SNMP / MIB telemetry source to standard SensorStream.
 */
public class LegacySnmpSensor {
    public String fetchOidValues(String oid) {
        return "SNMP_V2c_RESPONSE[OID=" + oid + ", VAL=42.8]";
    }
}
