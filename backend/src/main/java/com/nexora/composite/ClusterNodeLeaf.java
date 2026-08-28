package com.nexora.composite;

public class ClusterNodeLeaf implements ClusterComponent {
    private final String nodeName;
    private final double workload;

    public ClusterNodeLeaf(String nodeName, double workload) {
        this.nodeName = nodeName;
        this.workload = workload;
    }

    @Override
    public String getDesignation() { return nodeName; }

    @Override
    public double getTotalWorkload() { return workload; }

    @Override
    public void printHierarchy(String indent) {
        System.out.println(indent + "- Node: " + nodeName + " (" + workload + "%)");
    }
}
