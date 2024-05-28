import * as brain from 'brain.js'
import { logger } from '../logging'
import { SentenceService } from '../services'

export class GoodWords {
  trainer: brain.recurrent.RNN

  constructor (private readonly sentenceService: SentenceService) {
    this.trainer = new brain.recurrent.LSTM()
  }

  async startTraining (): Promise<boolean> {
    const trainingData = await this.sentenceService.getSentences()

    if (!trainingData) throw new Error('Failed to get training data')

    logger.info('Adding training data...', { trainingData })

    this.trainer.train(trainingData, {})

    logger.info('Finished training!')

    return true
  }

  public runner (value: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        resolve(this.trainer.run(value))
      } catch (error) {
        reject(error)
      }
    })
  }
}
