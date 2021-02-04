import { Channel as Chan } from 'extra-promise'
import { EventEmitter } from 'events'

export class Channel extends EventEmitter {
  private users = 0
  private chan: Chan<string>
  private iter: AsyncIterator<string, any, undefined>

  constructor() {
    super()
    this.chan = new Chan<string>()
    this.iter = this.chan.receive()[Symbol.asyncIterator]()
  }

  async enqueue(value: string): Promise<void> {
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
