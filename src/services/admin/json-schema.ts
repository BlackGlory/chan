import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema } from '@src/schema'

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
      const result = await Core.JsonSchema.getAllNamespaces()
      reply.send(result)
    }
  )

  server.get<{ Params: { namespace: string }}>(
    '/chan/:namespace/json-schema'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , response: {
          200: { type: 'string' }
        , 404: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const result = await Core.JsonSchema.get(namespace)
      if (result) {
        reply.header('content-type', 'application/json').send(result)
      } else {
        reply.status(404).send()
      }
    }
  )

  server.put<{ Params: { namespace: string }; Body: any }>(
    '/chan/:namespace/json-schema'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const schema = req.body
      await Core.JsonSchema.set(namespace, schema)
      reply.status(204).send()
    }
  )

  server.delete<{ Params: { namespace: string }}>(
    '/chan/:namespace/json-schema'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      await Core.JsonSchema.remove(namespace)
      reply.status(204).send()
    }
  )
}
