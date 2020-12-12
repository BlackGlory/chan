import { getChanChannelManager } from './chan-channel-manager'

export function dequeue(key: string): Promise<unknown> {
  const manager = getChanChannelManager()
  return manager.dequeue(key)
}
