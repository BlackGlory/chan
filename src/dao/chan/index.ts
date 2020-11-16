import { enqueue } from './enqueue'
import { dequeue } from './dequeue'

export const ChanDAO: IChanDAO<unknown> = {
  enqueue
, dequeue
}
