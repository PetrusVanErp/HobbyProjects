package com.company;

public class InsertionSort {
    void sort(int unsortedArray[]) {
        for (int i = 0; i < (unsortedArray.length - 1); i++) {
            int j = i + 1;

            while(j < (unsortedArray.length)) {
                if(unsortedArray[j] < unsortedArray[i]) {
                    int temp = unsortedArray[i];
                    unsortedArray[i] = unsortedArray[j];
                    unsortedArray[j] = temp;
                }
                j++;
            }
        }
    }
}
