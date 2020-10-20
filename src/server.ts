import fastify from 'fastify'
import cors from 'fastify-cors'
import { routes as mpmc } from '@services/mpmc'
import { routes as api } from '@services/api'
import { HTTP2 } from '@config'
import DAO from '@dao'

export function buildServer({ logger = false }: Partial<{ logger: boolean }> = {}) {
  const server = fastify(({
    logger
  , maxParamLength: 600
    /* @ts-ignore */
  , http2: HTTP2()
  }))
  server.register(cors, { origin: true })
  server.register(mpmc, { DAO })
  server.register(api, { DAO })
  return server
}
