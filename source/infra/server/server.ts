import express from 'express'
import cors from 'cors'

import { jobRouter } from './routes/job.route'

export class Server {
  public server = express()

  constructor() {
    this.start()
  }

  start(): void {
    this.middlewares()
    this.routes()
  }

  middlewares(): void {
    this.server.use(express.json())
    this.server.use(cors())
  }

  routes(): void {
    this.server.use('/jobs', jobRouter)
  }
}
