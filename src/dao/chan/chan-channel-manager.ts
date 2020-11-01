import { ChannelManager } from './channel-manager'

let manager = new ChannelManager<unknown>()

export function getCHANChannelManager(): ChannelManager<unknown> {
  return manager
}

export function rebuildCHANChannelManager(): void {
  manager = new ChannelManager<unknown>()
}
