import { ChanDAO } from '@dao'

export function enqueue(namespace: string, payload: string): Promise<void> {
  return ChanDAO.enqueue(namespace, payload)
}

export function dequeue(namespace: string): Promise<string> {
  return ChanDAO.dequeue(namespace)
}
