package com.company;

public class Square extends Shape implements Comparable<Square> {
    private int side;

    public double area() {
        return side * side;
    }

    public double perimeter() {
        return (side * side * side * side);
    }

    @Override
    public int compareTo(Square o) {
        return 0;
    }
}
