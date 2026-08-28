package com.nexora.state;

public class OnlineState implements NodeState {
    @Override
    public String getStatusName() { return "online"; }

    @Override
    public boolean canAcceptWorkload() { return true; }

    @Override
    public double getHealthFactor() { return 1.0; }
}
