import { resetChanChannelManager } from '@dao/data-in-memory/chan/channel-manager-instance'
import { ChanDAO } from '@dao/data-in-memory/chan'
import '@blackglory/jest-matchers'

beforeEach(resetChanChannelManager)

describe('ChanDAO', () => {
  describe('enqueue', () => {
    it('block', async done => {
      const key = 'key'
      const value = 'value'

      const result = ChanDAO.enqueue(key, value)
      result.then(() => done.fail())
      setImmediate(done)

      expect(result).toBePromise()
    })
  })

  describe('dequeue',  () => {
    it('block', async done => {
      const key = 'key'

      const result = ChanDAO.dequeue(key)
      result.then(() => done.fail())
      setImmediate(done)

      expect(result).toBePromise()
    })
  })

  describe('dequeue, enqueue', () => {
    it('non-block', async () => {
      const key = 'key'
      const value = 'value'

      setImmediate(() => ChanDAO.enqueue(key, value))
      const result = ChanDAO.dequeue(key)
      const proResult = await result

      expect(result).toBePromise()
      expect(proResult).toBe(value)
    })
  })

  describe('enqueue, dequeue', () => {
    it('non-block', async () => {
      const key = 'key'
      const value = 'value'

      setImmediate(() => ChanDAO.dequeue(key))
      const result = ChanDAO.enqueue(key, value)
      const proResult = await result

      expect(result).toBePromise()
      expect(proResult).toBeUndefined()
    })
  })
})
