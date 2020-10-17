import { FastifyPluginAsync } from 'fastify'
import * as TBAC from '@src/dao/token-based-access-control'
import { idSchema, tokenSchema } from '@src/schema'

export const routes: FastifyPluginAsync = async function routes(server, options) {
  // get all ids
  server.get<{ Params: { id: string }}>(
    '/mpmc-with-tokens'
  , {
      schema: {
        params: {
          type: 'object'
        , properties: {
            id: idSchema
          }
        }
      , response: {
          200: {
            type: 'array'
          , items: { type: 'string' }
          }
        }
      }
    }
  , (req, reply) => {
      const result = TBAC.getAllIdsWithTokens()
      reply.send(result)
    }
  )

  // get all tokens
  server.get<{
    Params: { id: string }
  }>(
    '/mpmc/:id/tokens'
  , {
      schema: {
        params: {
          type: 'object'
        , properties: {
            id: idSchema
          }
        }
      , response: {
          200: {
            type: 'array'
          , items: {
              type: 'object'
            , properties: {
                token: tokenSchema
              , enqueue: { type: 'boolean' }
              , dequeue: { type: 'boolean' }
              }
            }
          }
        }
      }
    }
  , (req, reply) => {
      const result = TBAC.getAllTokens(req.params.id)
      reply.send(result)
    }
  )

  // enqueue token
  server.put<{
    Params: { token: string, id: string }
  }>(
    '/mpmc/:id/tokens/:token/enqueue'
  , {
      schema: {
        params: {
          type: 'object'
        , properties: {
            token: tokenSchema
          , id: idSchema
          }
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , (req, reply) => {
      TBAC.setEnqueueToken({ token: req.params.token, id: req.params.id })
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { token: string, id: string }
  }>(
    '/mpmc/:id/tokens/:token/enqueue'
  , {
      schema: {
        params: {
          type: 'object'
        , properties: {
            token: tokenSchema
          , id: idSchema
          }
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , (req, reply) => {
      TBAC.unsetEnqueueToken({ token: req.params.token, id: req.params.id })
      reply.status(204).send()
    }
  )

  // dequeue token
  server.put<{
    Params: { token: string, id : string }
  }>(
    '/mpmc/:id/tokens/:token/dequeue'
  , {
      schema: {
        params: {
          type: 'object'
        , properties: {
            token: tokenSchema
          , id: idSchema
          }
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , (req, reply) => {
      TBAC.setDequeueToken({ token: req.params.token, id: req.params.id })
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { token: string, id : string }
  }>(
    '/mpmc/:id/tokens/:token/dequeue'
  , {
      schema: {
        params: {
          type: 'object'
        , properties: {
            token: tokenSchema
          , id: idSchema
          }
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , (req, reply) => {
      TBAC.unsetDequeueToken({ token: req.params.token, id: req.params.id })
      reply.status(204).send()
    }
  )
}
