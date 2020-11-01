import { FastifyPluginAsync } from 'fastify'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.get('/stats', (req, reply) => {
    const result = Core.stats()
    reply.send(result)
  })
}
