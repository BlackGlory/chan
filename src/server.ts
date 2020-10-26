import fastify from 'fastify'
import cors from 'fastify-cors'
import { routes as mpmc } from '@services/mpmc'
import { routes as api } from '@services/api'
import { routes as stats } from '@services/stats'
import { HTTP2, PAYLOAD_LIMIT } from '@config'
import { DAO } from '@dao'
import { createMPMC } from '@core'

export async function buildServer({ logger = false }: Partial<{ logger: boolean }> = {}) {
  const server = fastify(({
    logger
  , maxParamLength: 600
    /* @ts-ignore */
  , http2: HTTP2()
  , bodyLimit: PAYLOAD_LIMIT()
  }))
  server.register(cors, { origin: true })
  server.register(mpmc, { DAO, MPMC: await createMPMC<{ type?: string; payload: string }>() })
  server.register(api, { DAO })
  server.register(stats)
  return server
}
