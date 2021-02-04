import { Channel } from './channel'

export class ChannelManager {
  #map = new Map<string, Channel>()

  getChannel(key: string): Channel {
    if (!this.#map.has(key)) this.createChannel(key)

    const channel = this.#map.get(key)!
    return channel
  }

  private createChannel(key: string) {
    const channel = new Channel()
    channel.once('close', () => this.removeChannel(key))
    this.#map.set(key, channel)
  }

  private removeChannel(key: string) {
    this.#map.delete(key)
  }
}
