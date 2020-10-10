import fastify from 'fastify'
import cors from 'fastify-cors'
import { routes as mpmc } from '@src/services/mpmc'
import { routes as api } from '@src/services/api'

export function buildServer({ logger = false }: Partial<{ logger: boolean }> = {}) {
  const server = fastify(({
    logger
  , maxParamLength: 600
  }))
  server.register(cors, { origin: true })
  server.register(mpmc)
  server.register(api)
  return server
}
