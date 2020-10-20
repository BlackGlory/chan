interface IMPMC<T> {
  dequeue(key: string): Promise<T>
  enqueue(key: string, value: T): Promise<void>
}
