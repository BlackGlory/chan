import { getCHANChannelManager } from './chan-channel-manager'

export function dequeue(key: string): Promise<unknown> {
  const manager = getCHANChannelManager()
  return manager.dequeue(key)
}
