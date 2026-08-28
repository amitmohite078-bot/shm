package com.nexora.state;

public class OfflineState implements NodeState {
    @Override
    public String getStatusName() { return "offline"; }

    @Override
    public boolean canAcceptWorkload() { return false; }

    @Override
    public double getHealthFactor() { return 0.0; }
}
