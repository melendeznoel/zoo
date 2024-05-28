import { Router, Request, Response, NextFunction } from 'express'
import { GoodWords } from '../ml'
import { SentenceService } from '../services'
import { get } from 'lodash'


export class Routing {
  public router: Router
  public mlService: GoodWords

  constructor () {
    this.router = Router()
    this.mlService = new GoodWords(new SentenceService())

    this.setInfoRoute()
    this.setMlRoute()
  }

  public setInfoRoute () {
    this.router.get('/info', (req: Request, res: Response) => {
      res.json({ name: 'info', description: 'dev api' })
    })
  }

  public setMlRoute () {
    this.mlService.startTraining()
      .then(() => {
        this.router.post('/ml', this.postMl.bind(this))
      })
  }

  public async postMl (req: Request, res: Response, next: NextFunction) {
    const value = get(req, 'body.data.attributes.spoken')

    const result = await this.mlService.runner(value)

    res.json(result)
  }
}
