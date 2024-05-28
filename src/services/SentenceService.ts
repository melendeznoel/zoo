import { ISentence } from '../models'
import ML_DATA from '../../data/ml-sentence-data.json'

export class SentenceService {
  async getSentences () {
    const result: ISentence[] = []

    const mlData = ML_DATA.sentences

    mlData.forEach((s: ISentence) => {
      result.push(<ISentence>{
        input: s.input,
        output: s.output
      })
    })

    return result
  }

  async fetchSentences (): Promise<ISentence[]> {
    // https://apps.who.int/gho/athena/api/GHO/WHOSIS_000001?filter=COUNTRY:*&format=json
    const result: ISentence[] = []

    const sentencesResponse = await fetch('https://apps.who.int/gho/athena/api/GHO/WHOSIS_000001').catch(reason => {
      throw reason
    })

    const sentences = await sentencesResponse.json()

    return result
  }
}
