import { prepareDatabase as prepareAccessControlDatabase } from '@src/dao/access-control/database'
import { prepareDatabase as prepareJsonSchemaDatabase } from '@src/dao/json-schema/database'
import { buildServer } from './server'
import { PORT, HOST, CI } from '@env'

process.on('SIGHUP', () => process.exit(1))

;(async () => {
  await prepareAccessControlDatabase()
  await prepareJsonSchemaDatabase()

  const server = await buildServer()
  await server.listen(PORT(), HOST())
  if (CI()) await server.close()
})()
