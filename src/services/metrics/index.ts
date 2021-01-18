import { FastifyPluginAsync } from 'fastify'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.get('/metrics', (req, reply) => {
    const result = Core.metrics()
    reply.send(result)
  })
}
