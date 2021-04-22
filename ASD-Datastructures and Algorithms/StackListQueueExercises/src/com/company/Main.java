package com.company;

public class Main {

    public static void main(String[] args) {
        System.out.println("==========================================================");
        System.out.println("LINKED LIST");
        System.out.println("==========================================================");
        HANLinkedList<Integer> hanLinkedList = new HANLinkedList<>();
        hanLinkedList.addFirst(10);
        hanLinkedList.addFirst(5);
        hanLinkedList.addFirst(3);
        System.out.println("FIRST IN LIST: " + hanLinkedList.getFirst());
        System.out.println(hanLinkedList.get(1));
        System.out.println(hanLinkedList.get(2));
        System.out.println(hanLinkedList.get(3));
        System.out.println("SIZE: " + hanLinkedList.getSize());
        System.out.println("--------------");
        hanLinkedList.removeFirst();
        System.out.println("FIRST IN LIST: " + hanLinkedList.getFirst());
        System.out.println(hanLinkedList.get(1));
        System.out.println(hanLinkedList.get(2));
        System.out.println("SIZE: " + hanLinkedList.getSize());
        System.out.println("--------------");
        hanLinkedList.insert(3, 22);
        hanLinkedList.insert(1, 4);
        System.out.println("FIRST IN LIST: " + hanLinkedList.getFirst());
        System.out.println(hanLinkedList.get(1));
        System.out.println(hanLinkedList.get(2));
        System.out.println(hanLinkedList.get(3));
        System.out.println(hanLinkedList.get(4));
        System.out.println("SIZE: " + hanLinkedList.getSize());

        System.out.println("TO-STRING METHOD LINKED LIST: " + hanLinkedList.toString());

        System.out.println("==========================================================");
        System.out.println("QUEUE");
        System.out.println("==========================================================");
        HANQueue<Integer> hanQueue = new HANQueue<Integer>();
        hanQueue.enqueue(10);
        hanQueue.enqueue(5);
        hanQueue.enqueue(3);
        System.out.println(hanQueue.peek());
        hanQueue.dequeue();
        System.out.println(hanQueue.peek());
        hanQueue.dequeue();
        System.out.println(hanQueue.peek());

        System.out.println("===============================================");
        System.out.println("STACK");
        System.out.println("==========================================================");
        HANStack<Integer> hanStack = new HANStack<Integer>();
        hanStack.push(10);
        hanStack.push(5);
        hanStack.push(3);
        System.out.println(hanStack.peek());
        hanStack.pop();
        System.out.println(hanStack.peek());
        hanStack.pop();
        System.out.println(hanStack.peek());
    }
}
