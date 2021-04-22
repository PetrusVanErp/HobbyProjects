package com.company;

public class CustomArrayList<T> {
    private T[] array;
    private int lastIndex;
    private final int START_LENGTH = 50;

    public CustomArrayList() {
        array = (T[]) new Object[START_LENGTH];
        lastIndex = -1;
    }

    CustomArrayList(int startSize){
        array = (T[]) new Object[startSize];
        lastIndex = -1;
    }

    public void add(T element){
        lastIndex++;
        if(lastIndex >= array.length){
            doubleListSize();
        }
        array[lastIndex] = element;
    }

    public T get(int index){
        if(index > lastIndex){
            throw new ArrayIndexOutOfBoundsException();
        }
        return array[index];
    }

    public void set(int index, T element){
        if(index > lastIndex){
            throw new ArrayIndexOutOfBoundsException();
        }
        array[index]=element;
    }

    int maxSize(){
        return array.length;
    }

    void doubleListSize(){
        int[] test = new int[2];
        T[] newArray = (T[]) new Object[array.length*2];
        for(int i = 0;i < array.length;i++){
            newArray[i] = array[i];
        }
        array = newArray;
    }
}
