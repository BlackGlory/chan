interface IChanDAO<T> {
  enqueue(key: string, value: T): Promise<void>
  dequeue(key: string): Promise<T>
}
