import { resetChanChannelManager } from '@dao/data-in-memory/chan/channel-manager-instance'
import { ChanDAO } from '@dao/data-in-memory/chan'
import '@blackglory/jest-matchers'

beforeEach(resetChanChannelManager)

describe('ChanDAO', () => {
  describe('enqueue', () => {
    it('block', done => {
      const namespace = 'namespace'
      const value = 'value'

      const result = ChanDAO.enqueue(namespace, value)
      result.then(() => done.fail())
      setImmediate(done)

      expect(result).toBePromise()
    })
  })

  describe('dequeue',  () => {
    it('block', done => {
      const namespace = 'namespace'

      const result = ChanDAO.dequeue(namespace)
      result.then(() => done.fail())
      setImmediate(done)

      expect(result).toBePromise()
    })
  })

  describe('dequeue, enqueue', () => {
    it('non-block', async () => {
      const namespace = 'namespace'
      const value = 'value'

      setImmediate(() => ChanDAO.enqueue(namespace, value))
      const result = ChanDAO.dequeue(namespace)
      const proResult = await result

      expect(result).toBePromise()
      expect(proResult).toBe(value)
    })
  })

  describe('enqueue, dequeue', () => {
    it('non-block', async () => {
      const namespace = 'namespace'
      const value = 'value'

      setImmediate(() => ChanDAO.dequeue(namespace))
      const result = ChanDAO.enqueue(namespace, value)
      const proResult = await result

      expect(result).toBePromise()
      expect(proResult).toBeUndefined()
    })
  })
})
