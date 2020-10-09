import 'reflect-metadata'
import fastify from 'fastify'
import cors from 'fastify-cors'
import { routes as mpmc } from '@src/service/mpmc'
import { HOST, PORT } from '@src/config'

// API server
const server = fastify(({ logger: true }))
server.register(cors, { origin: true })
server.register(mpmc)
server.listen(PORT, HOST, (err, address) => {
  if (err) throw err
  console.log(`Server listening at ${address}`)
})
