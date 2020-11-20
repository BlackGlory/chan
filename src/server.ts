import fastify from 'fastify'
import cors from 'fastify-cors'
import { routes as chan } from '@services/chan'
import { routes as api } from '@services/api'
import { routes as stats } from '@services/stats'
import { HTTP2, PAYLOAD_LIMIT, NODE_ENV, NodeEnv } from '@env'
import { Core } from '@core'

export async function buildServer() {
  const server = fastify(({
    logger: getLoggerOptions()
  , maxParamLength: 600
    /* @ts-ignore */
  , http2: HTTP2()
  , bodyLimit: PAYLOAD_LIMIT()
  }))
  server.register(cors, { origin: true })
  server.register(chan, { Core })
  server.register(api, { Core })
  server.register(stats, { Core })
  return server
}

function getLoggerOptions() {
  switch (NODE_ENV()) {
    case NodeEnv.Test: return false
    case NodeEnv.Production: return { level: 'error' }
    case NodeEnv.Development: return { level: 'trace' }
    default: return false
  }
}
