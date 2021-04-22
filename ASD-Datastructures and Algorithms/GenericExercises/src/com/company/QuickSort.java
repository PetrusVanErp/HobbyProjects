package com.company;

import java.util.Arrays;

public class QuickSort {

    public static <T extends Comparable<T>> void sort(T[] unsortedList) {
        quicksort(unsortedList, 0, unsortedList.length - 1);
    }

    private static <T extends Comparable<T>> void quicksort(T[] unsortedList, int left, int right) {
        System.out.println("===========================");
        System.out.println(Arrays.toString(unsortedList));
        if (left < right) {
            int p = partition(unsortedList, left, right);
            quicksort(unsortedList, left, p);
            quicksort(unsortedList, p + 1, right);
        }
    }

    private static <T extends Comparable<T>> int partition(T[] unsortedList, int left, int right) {
        T x = unsortedList[left];
        int middle = (left + right) / 2;

        if ((unsortedList[left].compareTo(unsortedList[middle]) <= 0 && unsortedList[middle].compareTo(unsortedList[right]) <= 0)
                || (unsortedList[right].compareTo(unsortedList[middle]) <= 0 && unsortedList[middle].compareTo(unsortedList[left]) <= 0)) {
            x = unsortedList[middle];
        }

        if ((unsortedList[left].compareTo(unsortedList[right]) <= 0 && unsortedList[right].compareTo(unsortedList[middle]) <= 0)
                || (unsortedList[middle].compareTo(unsortedList[right]) <= 0 && unsortedList[right].compareTo(unsortedList[left]) <= 0)) {
            x = unsortedList[right];
        }

        int i = left - 1;
        int j = right + 1;

        while (true) {
            do i++; while (!(i > right || unsortedList[i].compareTo(x) >= 0));
            do j--; while (!(j < left || unsortedList[j].compareTo(x) <= 0));
            if (i < j) swap(unsortedList, i, j);
            else return j;
        }
    }

    private static <T extends Comparable<T>> void swap(T[] unsortedList, int i, int j) {
        T x;
        x = unsortedList[i];
        unsortedList[i] = unsortedList[j];
        unsortedList[j] = x;
    }
}
