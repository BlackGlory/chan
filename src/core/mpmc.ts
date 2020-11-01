import { MPMCDAO } from '@dao'

export function enqueue(id: string, payload: unknown): Promise<void> {
  return MPMCDAO.enqueue(id, payload)
}

export function dequeue(id: string): Promise<unknown> {
  return MPMCDAO.dequeue(id)
}
