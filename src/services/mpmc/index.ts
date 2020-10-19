import { FastifyPluginAsync } from 'fastify'
import { ChannelManager } from '@src/core/channel-manager'
import { routes as enqueueRoutes } from './enqueue'
import { routes as dequeueRoutes } from './dequeue'

export const routes: FastifyPluginAsync = async function routes(server, options) {
  const manager = new ChannelManager<{ type?: string; payload: string }>()

  server.register(dequeueRoutes, { manager })
  server.register(enqueueRoutes, { manager })
}
