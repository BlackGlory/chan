import { ChannelManager } from './channel-manager'

let manager = createChanChannelManager()

export function getChanChannelManager(): ChannelManager<unknown> {
  return manager
}

export function rebuildChanChannelManager(): void {
  manager = createChanChannelManager()
}

function createChanChannelManager(): ChannelManager<unknown> {
  return new ChannelManager<unknown>()
}
