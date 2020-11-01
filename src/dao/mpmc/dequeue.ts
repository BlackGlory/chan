import { getMPMCChannelManager } from './mpmc-channel-manager'

export function dequeue(key: string): Promise<unknown> {
  const manager = getMPMCChannelManager()
  return manager.dequeue(key)
}
