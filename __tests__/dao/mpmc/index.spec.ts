import { rebuildMPMCChannelManager } from '@dao/mpmc/mpmc-channel-manager'
import { MPMCDAO } from '@dao/mpmc'
import '@blackglory/jest-matchers'

beforeEach(() => {
  rebuildMPMCChannelManager()
})

describe('MPMCDAO', () => {
  describe('enqueue', () => {
    it('block', async done => {
      const key = 'key'
      const value = 'value'

      const result = MPMCDAO.enqueue(key, value)
      result.then(() => done.fail())
      setImmediate(done)

      expect(result).toBePromise()
    })
  })

  describe('dequeue',  () => {
    it('block', async done => {
      const key = 'key'

      const result = MPMCDAO.dequeue(key)
      result.then(() => done.fail())
      setImmediate(done)

      expect(result).toBePromise()
    })
  })

  describe('dequeue, enqueue', () => {
    it('non-block', async () => {
      const key = 'key'
      const value = 'value'

      setImmediate(() => MPMCDAO.enqueue(key, value))
      const result = MPMCDAO.dequeue(key)
      const proResult = await result

      expect(result).toBePromise()
      expect(proResult).toBe(value)
    })
  })

  describe('enqueue, dequeue', () => {
    it('non-block', async () => {
      const key = 'key'
      const value = 'value'

      setImmediate(() => MPMCDAO.dequeue(key))
      const result = MPMCDAO.enqueue(key, value)
      const proResult = await result

      expect(result).toBePromise()
      expect(proResult).toBeUndefined()
    })
  })
})
