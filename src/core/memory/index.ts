import { ChannelManager } from './channel-manager'

export async function createMPMC<T>() {
  return new ChannelManager<T>()
}
