package com.company;

import java.util.*;

public class Graph {

    private Map<String, Vertex> vertexMap;

    public Graph() {
        vertexMap = new HashMap<>();
    }

    /**
     * If vertexName is not present, add it to vertexMap.
     * In either case, return the Vertex.
     */
    private Vertex getVertex(String vertexName) {
        Vertex vertex = vertexMap.get(vertexName);
        if (vertex == null) {
            vertex = new Vertex(vertexName);
            vertexMap.put(vertexName, vertex);
        }
        return vertex;
    }

    public void calculateUnweightedShortestPath(String startVertexName) {
        Vertex startVertex = vertexMap.get(startVertexName);

        Queue<Vertex> queue = new LinkedList<Vertex>();
        startVertex.setDistance(1);
        queue.add(startVertex);

        while (!queue.isEmpty()) {
            Vertex vertex = queue.remove();

            System.out.println("==============================");
            System.out.println("From " + vertex.getName() + " you can get to: ");

            for (Edge edge : vertex.getAdjecentEdges()) {
                Vertex adjecentVertex = edge.getDestination();

                if (adjecentVertex.getDistance() == Double.MAX_VALUE) {
                    adjecentVertex.setDistance((vertex.getDistance() + 1));
                    adjecentVertex.setPrev(vertex);
                    queue.add(adjecentVertex);
                }
            }

            StringBuilder stringBuilder = new StringBuilder();
            for (int i = 0; i < vertex.getAdjecentEdges().size(); i++) {
                stringBuilder.append(vertex.getName()).append(" ----> ").append(vertex.getAdjecentEdges().get(i).getDestination().getName()).append("\n");
            }
            stringBuilder.append("Cost: ").append(vertex.getDistance()).append(" steps").append("\n");
            System.out.println(stringBuilder.toString());
        }
    }

    public void calculateWeightedShortestPath(String startVertexName) {
        Vertex startVertex = vertexMap.get(startVertexName);
        
    }

    public void addVertex(Vertex vertex) {
        vertexMap.put(vertex.getName(), vertex);
    }

    public String toString() {
        StringBuilder stringBuilder = new StringBuilder();

        for (Map.Entry<String, Vertex> stringVertexEntry : vertexMap.entrySet()) {

            Vertex tempVertex = (stringVertexEntry).getValue();
            List<Edge> adjecentEdges = tempVertex.getAdjecentEdges();

            stringBuilder.append((stringVertexEntry).getKey()).append(": ").append("\n")
                    .append("Name = ").append(tempVertex.getName()).append("\n")
                    .append("Edges = ");

            if (adjecentEdges.size() > 0) {
                for (Edge adjecentEdge : adjecentEdges) {
                    stringBuilder.append("Destination: ").append(adjecentEdge.getDestination().getName()).append(" - ")
                            .append("Cost: ").append(adjecentEdge.getCost()).append("\n");
                }
            } else {
                stringBuilder.append("none").append("\n");
            }

            stringBuilder.append("\n");

        }
        return stringBuilder.toString();
    }
}
