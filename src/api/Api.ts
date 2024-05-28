import express, { NextFunction, Request, Response, Express } from 'express'
import { Routing } from './Routing'


export class Api {
  public instance: Express

  constructor () {
    this.instance = express()
    /** Parse the request */
    this.instance.use(express.urlencoded({ extended: false }))
    /** Takes care of JSON data */
    this.instance.use(express.json())

    this.setMiddleware()
    this.setRoutes()
    this.setErrorHandler()
  }

  public setMiddleware () {
    /** RULES OF OUR API */
    this.instance.use((req: Request, res: Response, next: NextFunction) => {
      // set the CORS policy
      res.header('Access-Control-Allow-Origin', '*')
      // set the CORS headers
      res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization')
      // set the CORS method headers
      if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST')
        return res.status(200).json({})
      }
      next()
    })
  }

  public setErrorHandler () {
    /** Error handling */
    this.instance.use((req: Request, res: Response, next: NextFunction) => {
      const error = new Error('not found')
      return res.status(404).json({
        message: error.message
      })
    })
  }

  public setRoutes(){
    this.instance.use('/', new Routing().router)
  }
}
