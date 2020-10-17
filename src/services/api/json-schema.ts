import { idSchema } from '@src/schema'
import * as JsonSchema from '@src/dao/json-schema'
import { FastifyPluginAsync } from 'fastify'

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
  , (req, reply) => {
    const result = JsonSchema.getAllIdsWithJsonSchema()
    reply.send(result)
  })

  server.get<{ Params: { id: string }}>(
    '/mpmc/:id/json-schema'
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
    '/mpmc/:id/json-schema'
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
    '/mpmc/:id/json-schema'
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
    JsonSchema.removeJsonSchema(req.params.id)
    reply.status(204).send()
  })
}
