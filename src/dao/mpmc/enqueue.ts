import { getMPMCChannelManager } from './mpmc-channel-manager'

export function enqueue(key: string, value: unknown): Promise<void> {
  const manager = getMPMCChannelManager()
  return manager.enqueue(key, value)
}
