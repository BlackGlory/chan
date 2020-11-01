import { ChanDAO } from '@dao'

export function enqueue(id: string, payload: unknown): Promise<void> {
  return ChanDAO.enqueue(id, payload)
}

export function dequeue(id: string): Promise<unknown> {
  return ChanDAO.dequeue(id)
}
