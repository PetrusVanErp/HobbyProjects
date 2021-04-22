package nl.han.ica.datastructures;

import java.util.ArrayList;

public class HANStack<T> implements IHANStack<T>{

    private ArrayList<T> stack;

    public HANStack() {
        stack = new ArrayList<T>();
    }

    @Override
    public void push(T value) {
        stack.add(value);
    }

    @Override
    public T pop() {
        return stack.remove(stack.size() - 1);
    }

    @Override
    public T peek() {
        return stack.get(stack.size() - 1);
    }
}
