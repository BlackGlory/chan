interface IChanDAO {
  enqueue(namespace: string, value: string): Promise<void>
  dequeue(namespace: string): Promise<string>
}
