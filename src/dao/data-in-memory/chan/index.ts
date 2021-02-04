import { getChanChannelManager } from './channel-manager-instance'

export const ChanDAO: IChanDAO = {
  enqueue(key: string, value: string): Promise<void> {
    const manager = getChanChannelManager()
    const channel = manager.getChannel(key)
    return channel.enqueue(value)
  }
, dequeue(key: string): Promise<string> {
    const manager = getChanChannelManager()
    const channel = manager.getChannel(key)
    return channel.dequeue()
  }
}
