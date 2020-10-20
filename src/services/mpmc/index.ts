import { FastifyPluginAsync } from 'fastify'
import { ChannelManager } from '@src/core/channel-manager'
import { routes as enqueueRoutes } from './enqueue'
import { routes as dequeueRoutes } from './dequeue'

export const routes: FastifyPluginAsync<{ DAO: IDataAccessObject }> = async function routes(server, { DAO }) {
  const mpmc = new ChannelManager<{ type?: string; payload: string }>()

  server.register(dequeueRoutes, { mpmc, DAO })
  server.register(enqueueRoutes, { mpmc, DAO })
}
