package com.company;

public class LinkedListNode<T> {
    T element;
    LinkedListNode<T> next;

    public LinkedListNode(){
        element = null;
        next = null;
    }

    public LinkedListNode(T element, LinkedListNode<T> next) {
        this.element = element;
        this.next = next;
    }
}
