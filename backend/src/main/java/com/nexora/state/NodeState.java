package com.nexora.state;

/**
 * STATE PATTERN: NodeState interface encapsulating status transitions and behavior.
 */
public interface NodeState {
    String getStatusName();
    boolean canAcceptWorkload();
    double getHealthFactor();
}
