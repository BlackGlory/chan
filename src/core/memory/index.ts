import { ChannelManager } from './channel-manager'

export const MPMCFactory: IMPMCFactory = {
  async create<T>() {
    return new ChannelManager<T>()
  }
}
