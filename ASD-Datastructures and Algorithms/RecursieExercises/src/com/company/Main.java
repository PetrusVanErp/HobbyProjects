package com.company;

public class Main {

    public static void main(String[] args) {
        StringBuilder stringBuilder = new StringBuilder();

        final int NUMBER = 5;
        final String NAME = "Pepijn";

        int faculteitNR = faculteitNietRecursief(5);
        int faculteitR = faculteitRecursief(5, 5);

        int somNR = somNietRecursief(5);
        int somR = somRecursief(5, 5);

        String reversedName = nameReverser(NAME, stringBuilder);

        System.out.println("==================================================================");
        System.out.println("Faculteit van " + NUMBER + " niet recursief: " + faculteitNR);
        System.out.println("Faculteit van " + NUMBER + " recursief: " + faculteitR);
        System.out.println("------------------------------------------------------------------");
        System.out.println("Som van " + NUMBER + " niet recursief: " + somNR);
        System.out.println("Som van " + NUMBER + " recursief: " + somR);
        System.out.println("------------------------------------------------------------------");
        System.out.println("De naam " + NAME + " omgekeerd recursief is: " + reversedName);
        System.out.println("==================================================================");
    }

    // faculteit voorbeeld = 5! = 5*4*3*2*1 = 120
    // som voorbeeld = som(5) = 5+4+3+2+1 = 15

    public static int faculteitNietRecursief(int n) {
        int result = n;
        // n - 1 want je wilt niet dat je op het einde met 0 vermenigvuldigd
        int lengthOfNumber = n - 1;
        for (int i = 0; i < lengthOfNumber; i++) {
            result *= (n-1);
            n--;
        }
        return result;
    }

    public static int faculteitRecursief(int n, int tempResult) {
        int temp = tempResult;
        if(n > 1) {
            temp = tempResult * (n-1);
            n--;
            return faculteitRecursief(n, temp);
        } else {
            return temp;
        }
    }

    public static int somNietRecursief(int n) {
        int result = 0;
        int lengthOfNumber = n;
        for (int i = 0; i < lengthOfNumber; i++) {
            result += n;
            n--;
        }
        return result;
    }

    public static int somRecursief(int n, int tempResult) {
        int temp = tempResult + (n-1);
        if(n > 1) {
            n--;
            return somRecursief(n, temp);
        } else {
            return temp;
        }
    }

    public static String nameReverser(String name, StringBuilder stringBuilder) {
        String lastLetter = name.substring(name.length() - 1);
        String remainder = name.substring(0, name.length() - 1);

        stringBuilder.append(lastLetter);

        if(remainder.length() > 0) {
            return nameReverser(remainder, stringBuilder);
        } else {
            return stringBuilder.toString();
        }
    }
}
