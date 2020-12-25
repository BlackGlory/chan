import { Channel as Chan } from 'extra-promise'

export class Channel<T> {
  chan: Chan<T>
  iter: AsyncIterator<T, any, undefined>

  constructor() {
    this.chan = new Chan<T>()
    this.iter = this.chan.receive()[Symbol.asyncIterator]()
  }

  async put(value: T): Promise<void> {
    await this.chan.send(value)
  }

  async take() {
    const { value } = await this.iter.next()
    return value
  }

  close() {
    this.chan.close()
  }
}
