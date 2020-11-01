import { FastifyPluginAsync } from 'fastify'
import { idSchema, tokenSchema } from '@src/schema'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  // get all ids
  server.get<{ Params: { id: string }}>(
    '/chan-with-tokens'
  , {
      schema: {
        params: { id: idSchema }
      , response: {
          200: {
            type: 'array'
          , items: { type: 'string' }
          }
        }
      }
    }
  , async (req, reply) => {
      const result = await Core.TBAC.getAllIds()
      reply.send(result)
    }
  )

  // get all tokens
  server.get<{
    Params: { id: string }
  }>(
    '/chan/:id/tokens'
  , {
      schema: {
        params: { id: idSchema }
      , response: {
          200: {
            type: 'array'
          , items: {
              type: 'object'
            , properties: {
                token: tokenSchema
              , write: { type: 'boolean' }
              , read: { type: 'boolean' }
              }
            }
          }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      const result = await Core.TBAC.getTokens(id)
      reply.send(result)
    }
  )

  // publish token
  server.put<{
    Params: { token: string, id: string }
  }>(
    '/chan/:id/tokens/:token/write'
  , {
      schema: {
        params: {
          token: tokenSchema
        , id: idSchema
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      const token = req.params.token
      await Core.TBAC.setWriteToken(id, token)
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { token: string, id: string }
  }>(
    '/chan/:id/tokens/:token/write'
  , {
      schema: {
        params: {
          token: tokenSchema
        , id: idSchema
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      const token = req.params.token
      await Core.TBAC.unsetWriteToken(id, token)
      reply.status(204).send()
    }
  )

  // subscribe token
  server.put<{
    Params: { token: string, id : string }
  }>(
    '/chan/:id/tokens/:token/read'
  , {
      schema: {
        params: {
          token: tokenSchema
        , id: idSchema
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      const token = req.params.token
      await Core.TBAC.setReadToken(id, token)
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { token: string, id : string }
  }>(
    '/chan/:id/tokens/:token/read'
  , {
      schema: {
        params: {
          token: tokenSchema
        , id: idSchema
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      const token = req.params.token
      await Core.TBAC.unsetReadToken(id, token)
      reply.status(204).send()
    }
  )
}
