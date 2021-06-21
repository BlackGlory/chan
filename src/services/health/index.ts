import { FastifyPluginAsync } from 'fastify'
import { stripIndent } from 'common-tags'

export const routes: FastifyPluginAsync = async function routes(server) {
  server.get('/health', (req, reply) => {
    reply.send('OK')
  })
}
