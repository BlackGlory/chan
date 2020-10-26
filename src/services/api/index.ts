import { FastifyPluginAsync } from 'fastify'
import bearerAuthPlugin = require('fastify-bearer-auth')
import { ADMIN_PASSWORD } from '@env'
import { routes as jsonSchemaRoutes } from './json-schema'
import { routes as blacklistRoutes } from './blacklist'
import { routes as whitelistRoutes } from './whitelist'
import { routes as tokenBasedAccessControl } from './token-based-access-control'

export const routes: FastifyPluginAsync<{ DAO: IDataAccessObject }> = async function routes(server, { DAO }) {
  server.addContentTypeParser(
    'application/x-www-form-urlencoded'
  , { parseAs: 'string' }
  , (req, body, done) => done(null, body)
  )
  server.register(bearerAuthPlugin, {
    keys: new Set<string>() // because auth is a function, keys will be ignored.
  , auth(key, req) {
      if (ADMIN_PASSWORD() && key === ADMIN_PASSWORD()) return true
      return false
    }
  })

  server.register(jsonSchemaRoutes, { prefix: '/api', DAO })
  server.register(blacklistRoutes, { prefix: '/api', DAO })
  server.register(whitelistRoutes, { prefix: '/api', DAO })
  server.register(tokenBasedAccessControl, { prefix: '/api', DAO })
}
