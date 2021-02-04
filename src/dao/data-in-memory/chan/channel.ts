import { Channel as Chan } from 'extra-promise'
import { EventEmitter } from 'events'

export class Channel<T> extends EventEmitter {
  private users = 0
  private chan: Chan<T>
  private iter: AsyncIterator<T, any, undefined>

  constructor() {
    super()
    this.chan = new Chan<T>()
    this.iter = this.chan.receive()[Symbol.asyncIterator]()
  }

  async enqueue(value: T): Promise<void> {
    this.users++
    await this.chan.send(value)
    this.users--
    if (this.users === 0) this.close()
  }

  async dequeue() {
    this.users++
    const { value } = await this.iter.next()
    this.users--
    if (this.users === 0) this.close()
    return value
  }

  private close() {
    this.chan.close()
    this.emit('close')
  }
}
