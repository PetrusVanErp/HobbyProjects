package nl.han.ica.datastructures;

public class HANLinkedList<T> implements IHANLinkedList<T> {

    private LinkedListNode<T> header;
    private int size;

    public HANLinkedList() {
        header = new LinkedListNode<>();
        size = 0;
    }

    @Override
    public void addFirst(T value) {
        insert(0, value);
        size++;
    }

    @Override
    public void clear() {
        size = 0;
    }

    @Override
    public void insert(int index, T value) {
        LinkedListNode<T> prevNode = getNode(index - 1);

        if (prevNode != null) {
            LinkedListNode<T> newNode = new LinkedListNode<>(value, prevNode.next);
            prevNode.next = newNode;
            size++;
        }
    }

    @Override
    public void delete(int pos) {
        LinkedListNode<T> prevNode = getNode(pos - 1);
        LinkedListNode<T> nodeToBeDeleted = prevNode.next;
        prevNode.next = nodeToBeDeleted.next;
        size--;
    }

    @Override
    public T get(int pos) {
        LinkedListNode<T> node = getNode(pos);
        return node.element;
    }

    @Override
    public void removeFirst() {
        LinkedListNode<T> firstNode = getNode(0);
        header.next = firstNode.next;
        size--;
    }

    @Override
    public T getFirst() {
        LinkedListNode<T> firstNode = getNode(1);
        return firstNode.element;
    }

    @Override
    public int getSize() {
        return size;
    }

    private LinkedListNode<T> getNode(int pos) {
        LinkedListNode<T> currentNode = header;

        for (int i = 0; i < pos; i++) {
            currentNode = currentNode.next;
        }

        return currentNode;
    }

    public String toString() {
        StringBuilder stringBuilder = new StringBuilder();

        for (int i = 1; i < size - 1; i++) {
            stringBuilder.append(getNode(i).element).append(" ");
        }

        return stringBuilder.toString();
    }
}
