package com.company;

public class GenericMemoryCell implements Comparable<GenericMemoryCell> {
    private int storedValue;

    public int read() {
        return storedValue;
    }

    public void write(int x) {
        storedValue = x;
    }

    @Override
    public int compareTo(GenericMemoryCell o) {
        if(storedValue < o.read()) return -1;
        if(storedValue > o.read()) return 1;
        return 0;
    }
}
