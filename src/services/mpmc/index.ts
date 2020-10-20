import { FastifyPluginAsync } from 'fastify'
import { routes as enqueueRoutes } from './enqueue'
import { routes as dequeueRoutes } from './dequeue'

export const routes: FastifyPluginAsync<{
  DAO: IDataAccessObject
  MPMC: IMPMC<{ type?: string; payload: string }>
}> = async function routes(server, { DAO, MPMC }) {
  server.register(dequeueRoutes, { MPMC, DAO })
  server.register(enqueueRoutes, { MPMC, DAO })
}
