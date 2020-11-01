import { getCHANChannelManager } from './chan-channel-manager'

export function enqueue(key: string, value: unknown): Promise<void> {
  const manager = getCHANChannelManager()
  return manager.enqueue(key, value)
}
