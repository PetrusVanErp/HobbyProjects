package com.company;

import java.util.LinkedList;
import java.util.List;

public class Vertex {
    private String name;
    private List<Edge> adjecentEdges; // Adjacent edges

    // The following attributes are needed for the algorithm
    private double distance; // Cost
    private Vertex prev; // Previous vertex on shortest path

    public Vertex(String name) {
        this.name = name;
        this.adjecentEdges = new LinkedList<>();

        this.prev = null;
        this.distance = Double.MAX_VALUE;
    }

    public void addEdge(Edge edge) {
        adjecentEdges.add(edge);
    }

    public String getName() {
        return name;
    }

    public List<Edge> getAdjecentEdges() {
        return adjecentEdges;
    }

    public void setDistance(double distance) {
        this.distance = distance;
    }

    public double getDistance() {
        return this.distance;
    }

    public void setPrev(Vertex prev) {
        this.prev = prev;
    }

    public Vertex getPrev() {
        return prev;
    }
}
