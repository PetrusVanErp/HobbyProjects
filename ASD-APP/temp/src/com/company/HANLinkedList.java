package com.company;

public class HANLinkedList<T> {
    private LinkedListNode<T> header;
    private int size;

    public HANLinkedList() {
        header = new LinkedListNode<>();
        size = 0;
    }

    public void addFirst(T value){
        insert(0,value);
        size++;
    }

    public void removeFirst(){
        LinkedListNode<T> first = getNode(0);
        header.next = first.next;
        size--;
    }

    public T get(int index){
        LinkedListNode<T> node = getNode(index);
        return node.element;
    }

    public void delete(int index){
        LinkedListNode<T> previousNode = getNode(index - 1);
        LinkedListNode<T> nodeToDelete = previousNode.next;
        if(nodeToDelete == null){
            throw new IndexOutOfBoundsException();
        }
        previousNode.next = nodeToDelete.next;
        size--;
    }

    public void insert(int index, T value){
        LinkedListNode<T> previousNode = getNode(index - 1);
        LinkedListNode<T> nodeToInsert = new LinkedListNode<>(value, previousNode.next);
        previousNode.next = nodeToInsert;
        size++;
    }

    public int getSize(){
        return size;
    }

    private LinkedListNode<T> getNode(int index){
        LinkedListNode<T> currentNode = header;
        for(int i = 0; i<=index;i++){
            currentNode = currentNode.next;
            if(currentNode == null){
                throw new IndexOutOfBoundsException();
            }
        }
        return currentNode;
    }
}
