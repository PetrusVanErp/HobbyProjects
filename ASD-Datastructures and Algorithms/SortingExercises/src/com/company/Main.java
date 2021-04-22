package com.company;

import java.util.Random;

public class Main {

    public static void main(String[] args) {
        int[] unsortedArrayInsertionSort = {20, 6, 3, 12, 4, 7, 2, 1, 9, 11, 17, 3, 19, 17};

        System.out.println("Unsorted insertion sort array");
        printArray(unsortedArrayInsertionSort);

        InsertionSort insertionSorter = new InsertionSort();
        insertionSorter.sort(unsortedArrayInsertionSort);

        System.out.println("Sorted insertion sort array");
        printArray(unsortedArrayInsertionSort);

        System.out.println("===================================================================================");

	    int[] unsortedArrayMergeSort = {20, 6, 12, 4, 7, 2, 1, 9, 11, 17};

        System.out.println("Unsorted merge sort array");
        printArray(unsortedArrayMergeSort);

        MergeSort mergeSorter = new MergeSort();
        mergeSorter.sort(unsortedArrayMergeSort, 0, unsortedArrayMergeSort.length - 1);

        System.out.println("Sorted merge sort array");
        printArray(unsortedArrayMergeSort);

        System.out.println("===================================================================================");

        int[] unsortedArrayQuickSort = {20, 6, 12, 4, 6, 7, 2, 1, 11, 14, 10, 9};

        System.out.println("Unsorted quick sort array");
        printArray(unsortedArrayQuickSort);

        QuickSort quickSorter = new QuickSort();
        quickSorter.sort(unsortedArrayQuickSort, 0, unsortedArrayQuickSort.length -1);

        System.out.println("Sorted quick sort array");
        printArray(unsortedArrayQuickSort);
    }

    static void printArray(int list[]) {
        for (int i = 0; i < list.length; ++i)
            System.out.print(list[i] + " ");
        System.out.println();
    }

}
