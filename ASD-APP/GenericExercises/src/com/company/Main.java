package com.company;

public class Main {

    public static void main(String[] args) {
        String[] listOfStrings = {"Pieter", "Arie", "Senne", "Petronella", "Bas", "Ad"};

        System.out.println(min(listOfStrings));

        GenericMemoryCell genericMemoryCell_1 = new GenericMemoryCell();
        genericMemoryCell_1.write(1);
        GenericMemoryCell genericMemoryCell_2 = new GenericMemoryCell();
        genericMemoryCell_2.write(5);

        System.out.println(genericMemoryCell_1.compareTo(genericMemoryCell_2));

        QuickSort quicksort = new QuickSort();

        Integer[] a = new Integer[8];
        a[0] = 5;
        a[1] = 3;
        a[2] = 2;
        a[3] = 8;
        a[4] = 1;
        a[5] = 2;
        a[6] = 7;
        a[7] = 6;

        // T will be instantiated to Integer as a resutl of this call
        QuickSort.sort(a);

        // Print the result after the sorting
        for (int i = 0; i < a.length; i++)
            System.out.println(a[i].toString());
    }

    public static <E extends Comparable<E>> E min(E[] list) {
        E minValue = list[0];
        for (int i = 1; i < list.length; i++) {
            if (minValue.compareTo(list[i]) > 0) {
                minValue = list[i];
            }

        }
        return minValue;
    }
}
