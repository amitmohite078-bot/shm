package com.nexora.composite;

/**
 * COMPOSITE PATTERN: Base component for cluster hierarchy.
 */
public interface ClusterComponent {
    String getDesignation();
    double getTotalWorkload();
    void printHierarchy(String indent);
}
