import { ok, throws } from 'assert'
import { stub } from 'sinon'
import { GcpService } from '../../src/gcp'
import { GoodWords } from '../../src/ml'
import { IPhrase } from '../../src/models'

describe('GcpService', () => {
  describe('_handleError function', () => {
    it('should throws error', async () => {
      const mockGoodWordsService: any = {}

      const gcpService = new GcpService({ topicName: 'mockname', projectId: 'mockid' }, mockGoodWordsService)

      throws(() => {
        return gcpService._handleError({})
      })
    })
  })
})
