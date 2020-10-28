import { FastifyPluginAsync } from 'fastify'
import { idSchema, tokenSchema } from '@src/schema'

export const routes: FastifyPluginAsync<{ DAO: IDataAccessObject }> = async function routes(server, { DAO }) {
  // get all ids
  server.get<{ Params: { id: string }}>(
    '/mpmc-with-tokens'
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
      const result = await DAO.getAllIdsWithTokens()
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
        params: { id: idSchema }
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
  , async (req, reply) => {
      const result = await DAO.getAllTokens(req.params.id)
      reply.send(result)
    }
  )

  // enqueue token
  server.put<{
    Params: { token: string, id: string }
  }>(
    '/mpmc/:id/tokens/:token/write'
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
      await DAO.setWriteToken({ token: req.params.token, id: req.params.id })
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { token: string, id: string }
  }>(
    '/mpmc/:id/tokens/:token/write'
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
      await DAO.unsetWriteToken({ token: req.params.token, id: req.params.id })
      reply.status(204).send()
    }
  )

  // dequeue token
  server.put<{
    Params: { token: string, id : string }
  }>(
    '/mpmc/:id/tokens/:token/read'
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
      await DAO.setReadToken({ token: req.params.token, id: req.params.id })
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { token: string, id : string }
  }>(
    '/mpmc/:id/tokens/:token/read'
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
      await DAO.unsetReadToken({ token: req.params.token, id: req.params.id })
      reply.status(204).send()
    }
  )
}
