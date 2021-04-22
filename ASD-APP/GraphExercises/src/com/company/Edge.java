package com.company;

public class Edge {
    private Vertex destination; // Second vertex in edge
    private double cost;

    public Edge(Vertex destination, double cost) {
        this.destination = destination;
        this.cost = cost;
    }

    public double getCost() {
        return cost;
    }

    public Vertex getDestination() {
        return destination;
    }
}
