import { getChanChannelManager } from './channel-manager-instance'

export const ChanDAO: IChanDAO = {
  enqueue(namespace: string, value: string): Promise<void> {
    const manager = getChanChannelManager()
    const channel = manager.getChannel(namespace)
    return channel.enqueue(value)
  }
, dequeue(namespace: string): Promise<string> {
    const manager = getChanChannelManager()
    const channel = manager.getChannel(namespace)
    return channel.dequeue()
  }
}
