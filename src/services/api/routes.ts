import { FastifyPluginAsync } from 'fastify'
import * as TBAC from '@src/dao/token-based-access-control'
import * as Blacklist from '@src/dao/blacklist'
import * as Whitelist from '@src/dao/whitelist'
import * as JsonSchema from '@src/dao/json-schema'
import bearerAuthPlugin = require('fastify-bearer-auth')
import { ADMIN_PASSWORD } from '@src/config'
import { idSchema, tokenSchema } from '@src/schema'

export const routes: FastifyPluginAsync = async function routes(server, options) {
  server.register(bearerAuthPlugin, {
    keys: new Set<string>() // because auth is a function, keys will be ignored.
  , auth(key, req) {
      if (ADMIN_PASSWORD() && key === ADMIN_PASSWORD()) return true
      return false
    }
  })

  // json schema
  server.get(
    '/api/mpmc-with-json-schema'
  , {
      schema: {
        response: {
          200: {
            type: 'array'
          , items: { type: 'string' }
          }
        }
      }
    }
  , (req, reply) => {
    const result = JsonSchema.getAllIdsWithJsonSchema()
    reply.send(result)
  })

  server.get<{ Params: { id: string }}>(
    '/api/mpmc/:id/json-schema'
  , {
      schema: {
        params: {
          type: 'object'
        , properties: {
            id: idSchema
          }
        }
      , response: {
          200: { type: 'string' }
        , 404: { type: 'null' }
        }
      }
    }
  , (req, reply) => {
    const result = JsonSchema.getJsonSchema(req.params.id)
    if (result) {
      reply.header('content-type', 'application/json').send(result)
    } else {
      reply.status(404).send()
    }
  })

  server.put<{ Params: { id: string }; Body: any }>(
    '/api/mpmc/:id/json-schema'
  , {
      schema: {
        params: {
          type: 'object'
        , properties: {
            id: idSchema
          }
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , (req, reply) => {
    JsonSchema.setJsonSchema({
      id: req.params.id
    , schema: JSON.stringify(req.body, null, 2)
    })
    reply.status(204).send()
  })

  server.delete<{ Params: { id: string }}>(
    '/api/mpmc/:id/json-schema'
  , {
      schema: {
        params: {
          type: 'object'
        , properties: {
            id: idSchema
          }
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , (req, reply) => {
    const result = JsonSchema.removeJsonSchema(req.params.id)
    reply.status(204).send()
  })

  // blacklist
  server.get(
    '/api/blacklist'
  , {
      schema: {
        response: {
          200: {
            type: 'array'
          , items: { type: 'string' }
          }
        }
      }
    }
  , (req, reply) => {
    const result = Blacklist.getAllBlacklistItems()
    reply.send(result)
  })

  server.put<{ Params: { id: string }}>(
    '/api/blacklist/:id'
  , {
      schema: {
        params: {
          type: 'object'
        , properties: {
            id: idSchema
          }
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , (req, reply) => {
      Blacklist.addBlacklistItem(req.params.id)
      reply.status(204).send()
    }
  )

  server.delete<{ Params: { id: string }}>(
    '/api/blacklist/:id'
  , {
      schema: {
        params: {
          type: 'object'
        , properties: {
            id: idSchema
          }
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , (req, reply) => {
      Blacklist.removeBlacklistItem(req.params.id)
      reply.status(204).send()
    }
  )

  // whitelist
  server.get(
    '/api/whitelist'
  , {
      schema: {
        response: {
          200: {
            type: 'array'
          , items: { type: 'string' }
          }
        }
      }
    }
  , (req, reply) => {
    const result = Whitelist.getAllWhitelistItems()
    reply.send(result)
  })

  server.put<{ Params: { id: string }}>(
    '/api/whitelist/:id'
  , {
      schema: {
        params: {
          type: 'object'
        , properties: {
            id: idSchema
          }
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , (req, reply) => {
      Whitelist.addWhitelistItem(req.params.id)
      reply.status(204).send()
    }
  )

  server.delete<{ Params: { id: string }}>(
    '/api/whitelist/:id'
  , {
      schema: {
        params: {
          type: 'object'
        , properties: {
            id: idSchema
          }
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , (req, reply) => {
    Whitelist.removeWhitelistItem(req.params.id)
    reply.status(204).send()
  })

  // get all ids
  server.get<{ Params: { id: string }}>(
    '/api/mpmc-with-tokens'
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
    '/api/mpmc/:id/tokens'
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
    '/api/mpmc/:id/tokens/:token/enqueue'
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
    '/api/mpmc/:id/tokens/:token/enqueue'
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
    '/api/mpmc/:id/tokens/:token/dequeue'
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
    '/api/mpmc/:id/tokens/:token/dequeue'
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
