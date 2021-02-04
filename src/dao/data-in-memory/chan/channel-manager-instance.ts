import { ChannelManager } from './channel-manager'

let manager = createChanChannelManager()

export function getChanChannelManager(): ChannelManager {
  return manager
}

export function resetChanChannelManager(): void {
  manager = createChanChannelManager()
}

function createChanChannelManager(): ChannelManager {
  return new ChannelManager()
}
