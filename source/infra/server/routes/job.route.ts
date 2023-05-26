import express from 'express'

import { ExpressRouterAdapter } from '../adapters/expressAdapter'
import { ExtractJobsComposer } from '../../../data/composers/extract-jobs.composer'

const jobRouter = express.Router()

jobRouter.post(
  '/extract',
  ExpressRouterAdapter.adapt(ExtractJobsComposer.compose())
)

export { jobRouter }
