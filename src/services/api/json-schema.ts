import { FastifyPluginAsync } from 'fastify'
import { idSchema } from '@src/schema'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.get(
    '/chan-with-json-schema'
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
      const result = await Core.JsonSchema.getAllIds()
      reply.send(result)
    }
  )

  server.get<{ Params: { id: string }}>(
    '/chan/:id/json-schema'
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
      const id = req.params.id
      const result = await Core.JsonSchema.get(id)
      if (result) {
        reply.header('content-type', 'application/json').send(result)
      } else {
        reply.status(404).send()
      }
    }
  )

  server.put<{ Params: { id: string }; Body: any }>(
    '/chan/:id/json-schema'
  , {
      schema: {
        params: { id: idSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      const schema = req.body
      await Core.JsonSchema.set(id, schema)
      reply.status(204).send()
    }
  )

  server.delete<{ Params: { id: string }}>(
    '/chan/:id/json-schema'
  , {
      schema: {
        params: { id: idSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      await Core.JsonSchema.remove(id)
      reply.status(204).send()
    }
  )
}
