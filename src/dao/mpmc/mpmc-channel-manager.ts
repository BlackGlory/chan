import { ChannelManager } from './channel-manager'

let manager = new ChannelManager<unknown>()

export function getMPMCChannelManager(): ChannelManager<unknown> {
  return manager
}

export function rebuildMPMCChannelManager(): void {
  manager = new ChannelManager<unknown>()
}
