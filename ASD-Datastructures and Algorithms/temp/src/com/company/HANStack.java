package com.company;

public class HANStack<T> {
    private HANLinkedList<T> stack;

    public HANStack(){
        stack = new HANLinkedList<>();
    }

    public void pop(){
        stack.removeFirst();
    }

    public T top(){
        return stack.get(0);
    }

    public int getSize(){
        return stack.getSize();
    }
}
