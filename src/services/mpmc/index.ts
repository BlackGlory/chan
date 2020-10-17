import { FastifyPluginAsync } from 'fastify'
import { ChannelManager } from '@src/core/channel-manager'
import urlencodedParser from '@src/urlencoded-parser'
import { routes as enqueueRoutes } from './enqueue'
import { routes as dequeueRoutes } from './dequeue'

export const routes: FastifyPluginAsync = async function routes(server, options) {
  server.register(urlencodedParser, { parseAs: 'string' })
  const manager = new ChannelManager<{ type?: string; payload: string }>()

  server.register(dequeueRoutes, { manager })
  server.register(enqueueRoutes, { manager })
}
