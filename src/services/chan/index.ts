import { FastifyPluginAsync } from 'fastify'
import { routes as enqueueRoutes } from './enqueue'
import { routes as dequeueRoutes } from './dequeue'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.register(dequeueRoutes, { Core })
  server.register(enqueueRoutes, { Core })
}
