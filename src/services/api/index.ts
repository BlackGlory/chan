import { FastifyPluginAsync } from 'fastify'
import bearerAuthPlugin = require('fastify-bearer-auth')
import { routes as jsonSchemaRoutes } from './json-schema'
import { routes as blacklistRoutes } from './blacklist'
import { routes as whitelistRoutes } from './whitelist'
import { routes as tokenPolicyRoutes } from './token-policy'
import { routes as tokenRoutes } from './token'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.addContentTypeParser(
    'application/x-www-form-urlencoded'
  , { parseAs: 'string' }
  , (req, body, done) => done(null, body)
  )
  server.register(bearerAuthPlugin, {
    keys: new Set<string>() // because auth is a function, keys will be ignored.
  , auth(key, req) {
      return Core.isAdmin(key)
    }
  })

  server.register(jsonSchemaRoutes, { prefix: '/api', Core })
  server.register(blacklistRoutes, { prefix: '/api', Core })
  server.register(whitelistRoutes, { prefix: '/api', Core })
  server.register(tokenPolicyRoutes, { prefix: '/api', Core })
  server.register(tokenRoutes, { prefix: '/api', Core })
}
