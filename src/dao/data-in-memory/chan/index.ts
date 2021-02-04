import { getChanChannelManager } from './channel-manager-instance'

export const ChanDAO: IChanDAO<unknown> = {
  enqueue(key: string, value: unknown): Promise<void> {
    const manager = getChanChannelManager()
    const channel = manager.getChannel(key)
    return channel.enqueue(value)
  }
, dequeue(key: string): Promise<unknown> {
    const manager = getChanChannelManager()
    const channel = manager.getChannel(key)
    return channel.dequeue()
  }
}
