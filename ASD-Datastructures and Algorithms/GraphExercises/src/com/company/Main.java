package com.company;

public class Main {

    public static void main(String[] args) {
	    Graph graph = new Graph();

	    createVerticesWithEdges(graph);

        System.out.println(graph.toString());

		System.out.println("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
        //calculateUnweightedShortestPath(graph, "vertex0");
		System.out.println("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

		System.out.println("\n");

		System.out.println("-------------------------------------------------------------------------");
		calculateWeightedShortestPath(graph, "vertex0");
		System.out.println("-------------------------------------------------------------------------");
	}

	public static void calculateUnweightedShortestPath(Graph graph, String startVertexName) {
    	graph.calculateUnweightedShortestPath(startVertexName);
	}

	public static void calculateWeightedShortestPath(Graph graph, String startVertexName) {
		graph.calculateWeightedShortestPath(startVertexName);
	}

	public static void createVerticesWithEdges(Graph graph){
		Vertex vertex0 = new Vertex("vertex0");
		Vertex vertex1 = new Vertex("vertex1");
		Vertex vertex2 = new Vertex("vertex2");
		Vertex vertex3 = new Vertex("vertex3");
		Vertex vertex4 = new Vertex("vertex4");
		Vertex vertex5 = new Vertex("vertex5");
		Vertex vertex6 = new Vertex("vertex6");

		Edge edgeV0V1 = new Edge(vertex1, 2);
		Edge edgeV0V3 = new Edge(vertex3, 1);
		Edge edgeV1V3 = new Edge(vertex3, 3);
		Edge edgeV1V4 = new Edge(vertex4, 10);
		Edge edgeV2V0 = new Edge(vertex0, 4);
		Edge edgeV2V5 = new Edge(vertex5, 5);
		Edge edgeV3V2 = new Edge(vertex2, 2);
		Edge edgeV3V4 = new Edge(vertex4, 2);
		Edge edgeV3V5 = new Edge(vertex5, 8);
		Edge edgeV3V6 = new Edge(vertex6, 4);
		Edge edgeV4V6 = new Edge(vertex6, 6);
		Edge edgeV6V5 = new Edge(vertex5, 1);

		vertex0.addEdge(edgeV0V1);
		vertex0.addEdge(edgeV0V3);
		vertex1.addEdge(edgeV1V3);
		vertex1.addEdge(edgeV1V4);
		vertex2.addEdge(edgeV2V0);
		vertex2.addEdge(edgeV2V5);
		vertex3.addEdge(edgeV3V2);
		vertex3.addEdge(edgeV3V4);
		vertex3.addEdge(edgeV3V5);
		vertex3.addEdge(edgeV3V6);
		vertex4.addEdge(edgeV4V6);
		vertex6.addEdge(edgeV6V5);

		graph.addVertex(vertex0);
		graph.addVertex(vertex1);
		graph.addVertex(vertex2);
		graph.addVertex(vertex3);
		graph.addVertex(vertex4);
		graph.addVertex(vertex5);
		graph.addVertex(vertex6);
	}
}
