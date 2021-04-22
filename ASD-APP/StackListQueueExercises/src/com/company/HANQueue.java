package com.company;

import java.util.LinkedList;

public class HANQueue<T> implements IHANQueue<T> {

    private LinkedList<T> elements;

    public HANQueue() {
        this.elements = new LinkedList<T>();
    }

    @Override
    public void clear() {
        elements.clear();
    }

    @Override
    public boolean isEmpty() {
        return false;
    }

    @Override
    public void enqueue(T value) {
        elements.add(value);
    }

    @Override
    public T dequeue() {
        T t = elements.getFirst();
        elements.remove(t);
        return t;
    }

    @Override
    public T peek() {
        return elements.getFirst();
    }

    @Override
    public int getSize() {
        return elements.size();
    }
}
