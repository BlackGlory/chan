import { enqueue } from './enqueue'
import { dequeue } from './dequeue'

export const MPMCDAO: IMPMCDAO<unknown> = {
  enqueue
, dequeue
}
