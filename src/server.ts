import 'reflect-metadata'
import fastify from 'fastify'
import cors from 'fastify-cors'
import { routes as mpmc } from '@src/services/mpmc'
import { routes as api } from '@src/services/api'
import { HOST, PORT } from '@src/config'

export function startup() {
  const server = fastify(({
    logger: true
  , maxParamLength: 500
  }))
  server.register(cors, { origin: true })
  server.register(mpmc)
  server.register(api)
  server.listen(PORT, HOST, (err, address) => {
    if (err) throw err
    console.log(`Server listening at ${address}`)
  })

  return () => server.close()
}
