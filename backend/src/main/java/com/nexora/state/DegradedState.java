package com.nexora.state;

public class DegradedState implements NodeState {
    @Override
    public String getStatusName() { return "degraded"; }

    @Override
    public boolean canAcceptWorkload() { return true; }

    @Override
    public double getHealthFactor() { return 0.65; }
}
