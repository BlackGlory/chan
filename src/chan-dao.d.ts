interface IChanDAO {
  enqueue(key: string, value: string): Promise<void>
  dequeue(key: string): Promise<string>
}
