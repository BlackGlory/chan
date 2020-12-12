import { getChanChannelManager } from './chan-channel-manager'

export function enqueue(key: string, value: unknown): Promise<void> {
  const manager = getChanChannelManager()
  return manager.enqueue(key, value)
}
