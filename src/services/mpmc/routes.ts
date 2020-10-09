import { FastifyPluginAsync } from 'fastify'
import { ChannelManager } from './channel-manager'
import urlencodedParser from '@src/urlencoded-parser'

export const routes: FastifyPluginAsync = async function routes(server, options) {
  server.register(urlencodedParser, { parseAs: 'string' })
  const manager = new ChannelManager<string>()

  server.get<{ Params: { id: string }}>('/mpmc/:id', async (req, reply) => {
    const value = await manager.take(req.params.id)
    reply.send(value)
  })

  server.post<{
    Params: { id: string }
  , Body: string
  }>('/mpmc/:id', async (req, reply) => {
    await manager.put(req.params.id, req.body)
    reply.status(204).send()
  })
}
