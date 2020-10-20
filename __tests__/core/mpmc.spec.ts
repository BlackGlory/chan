import { createMPMC } from '@core'
import '@blackglory/jest-matchers'

describe('MPMC', () => {
  describe('enqueue', () => {
    it('block', async done => {
      const mpmc = await createMPMC()
      const key = 'key'
      const value = 'value'

      const result = mpmc.enqueue(key, value)
      result.then(() => done.fail())
      setImmediate(done)

      expect(result).toBePromise()
    })
  })

  describe('dequeue',  () => {
    it('block', async done => {
      const mpmc = await createMPMC()
      const key = 'key'

      const result = mpmc.dequeue(key)
      result.then(() => done.fail())
      setImmediate(done)

      expect(result).toBePromise()
    })
  })

  describe('dequeue, enqueue', () => {
    it('non-block', async () => {
      const mpmc = await createMPMC()
      const key = 'key'
      const value = 'value'

      setImmediate(() => mpmc.enqueue(key, value))
      const result = mpmc.dequeue(key)
      const proResult = await result

      expect(result).toBePromise()
      expect(proResult).toBe(value)
    })
  })

  describe('enqueue, dequeue', () => {
    it('non-block', async () => {
      const mpmc = await createMPMC()
      const key = 'key'
      const value = 'value'

      setImmediate(() => mpmc.dequeue(key))
      const result = mpmc.enqueue(key, value)
      const proResult = await result

      expect(result).toBePromise()
      expect(proResult).toBeUndefined()
    })
  })
})
