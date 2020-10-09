import { Channel } from './channel'

export class ChannelManager<T> {
  #map = new Map<string, Channel<T>>()

  private getChannel(key: string) {
    if (!this.#map.has(key)) this.#map.set(key, new Channel())
    const channel = this.#map.get(key)!
    return channel
  }

  async put(key: string, value: T) {
    const channel = this.getChannel(key)
    await channel.put(value)
  }

  async take(key: string) {
    const channel = this.getChannel(key)
    return await channel.take()
  }

  remove(key: string) {
    if (this.#map.has(key)) {
      const channel = this.#map.get(key)!
      channel.close()
      this.#map.delete(key)
    }
  }
}
