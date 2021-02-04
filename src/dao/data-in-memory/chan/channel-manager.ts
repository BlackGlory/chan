import { Channel } from './channel'

export class ChannelManager<T> {
  #map = new Map<string, Channel<T>>()

  getChannel(key: string): Channel<T> {
    if (!this.#map.has(key)) this.createChannel(key)

    const channel = this.#map.get(key)!
    return channel
  }

  private createChannel(key: string) {
    const channel = new Channel<T>()
    channel.once('close', () => this.removeChannel(key))
    this.#map.set(key, channel)
  }

  private removeChannel(key: string) {
    this.#map.delete(key)
  }
}
