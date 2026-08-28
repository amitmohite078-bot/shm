package com.nexora.composite;

import java.util.ArrayList;
import java.util.List;

public class SystemClusterComposite implements ClusterComponent {
    private final String clusterName;
    private final List<ClusterComponent> children = new ArrayList<>();

    public SystemClusterComposite(String clusterName) {
        this.clusterName = clusterName;
    }

    public void add(ClusterComponent component) {
        children.add(component);
    }

    public void remove(ClusterComponent component) {
        children.remove(component);
    }

    @Override
    public String getDesignation() { return clusterName; }

    @Override
    public double getTotalWorkload() {
        return children.stream().mapToDouble(ClusterComponent::getTotalWorkload).average().orElse(0.0);
    }

    @Override
    public void printHierarchy(String indent) {
        System.out.println(indent + "+ Cluster: " + clusterName + " [Avg Load: " + getTotalWorkload() + "%]");
        for (ClusterComponent child : children) {
            child.printHierarchy(indent + "   ");
        }
    }
}
