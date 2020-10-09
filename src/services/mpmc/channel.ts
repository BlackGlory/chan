import { makeChannel } from 'extra-promise'

export class Channel<T> {
  #send: (value: T) => Promise<void>;
  #next: () => Promise<T>
  #close: () => void;

  constructor() {
    const [send, receive, close] = makeChannel<T>()
    const iter = receive()[Symbol.asyncIterator]()
    this.#send = send
    this.#close = close
    this.#next = async () => (await iter.next()).value
  }

  async put(value: T) {
    return this.#send(value)
  }

  async take() {
    return this.#next()
  }

  close() {
    this.#close()
  }
}
