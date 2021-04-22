package com.company;

import java.util.LinkedList;

public class HANStack<T> implements IHANStack<T> {

    private LinkedList<T> elements;

    public HANStack() {
        elements = new LinkedList<>();
    }

    @Override
    public void push(T value) {
        elements.add(value);
    }

    @Override
    public T pop() {
        T t = elements.getLast();
        elements.remove(t);
        return t;
    }

    @Override
    public T peek() {
        return elements.getLast();
    }
}
