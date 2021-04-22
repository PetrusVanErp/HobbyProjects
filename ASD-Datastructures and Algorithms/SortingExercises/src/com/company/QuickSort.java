package com.company;

import java.util.Arrays;

public class QuickSort {

    int partition(int arr[], int low, int high) {
        int pivot = arr[high];
        int i = (low - 1);

        System.out.println(pivot);

        for (int j = low; j < high; j++) {
            if(arr[j] < pivot) {
                i++;

                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }

        int temp = arr[i + 1];
        arr[i+1] = arr[high];
        arr[high] = temp;

        return i+1;
    }


    void sort(int unsortedArray[], int low, int high) {
        if(low < high) {
            int partitionIndex = partition(unsortedArray, low, high);

            System.out.println(Arrays.toString(unsortedArray));

            sort(unsortedArray, low, partitionIndex -1);
            sort(unsortedArray, partitionIndex + 1, high);
        }
    }
}
