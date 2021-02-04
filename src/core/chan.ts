import { ChanDAO } from '@dao'

export function enqueue(id: string, payload: string): Promise<void> {
  return ChanDAO.enqueue(id, payload)
}

export function dequeue(id: string): Promise<string> {
  return ChanDAO.dequeue(id)
}
