import { FastifyPluginAsync } from 'fastify'
import { idSchema } from '@src/schema'
import DAO from '@src/dao'

export const routes: FastifyPluginAsync = async function routes(server, options) {
  server.get(
    '/mpmc-with-json-schema'
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
  , async (req, reply) => {
    const result = await DAO.getAllIdsWithJsonSchema()
    reply.send(result)
  })

  server.get<{ Params: { id: string }}>(
    '/mpmc/:id/json-schema'
  , {
      schema: {
        params: { id: idSchema }
      , response: {
          200: { type: 'string' }
        , 404: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
    const result = await DAO.getJsonSchema(req.params.id)
    if (result) {
      reply.header('content-type', 'application/json').send(result)
    } else {
      reply.status(404).send()
    }
  })

  server.put<{ Params: { id: string }; Body: any }>(
    '/mpmc/:id/json-schema'
  , {
      schema: {
        params: { id: idSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
    await DAO.setJsonSchema({
      id: req.params.id
    , schema: JSON.stringify(req.body, null, 2)
    })
    reply.status(204).send()
  })

  server.delete<{ Params: { id: string }}>(
    '/mpmc/:id/json-schema'
  , {
      schema: {
        params: { id: idSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
    await DAO.removeJsonSchema(req.params.id)
    reply.status(204).send()
  })
}
