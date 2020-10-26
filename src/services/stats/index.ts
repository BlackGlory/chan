import { FastifyPluginAsync } from 'fastify'

export const routes: FastifyPluginAsync = async function routes(server, options) {
  server.get('/stats', (req, reply) => {
    reply.send({
      memoryUsage: process.memoryUsage()
    , cpuUsage: process.cpuUsage()
    , resourceUsage: process.resourceUsage()
    })
  })
}
