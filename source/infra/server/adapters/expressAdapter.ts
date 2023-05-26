import * as Sentry from '@sentry/node'

import '@sentry/tracing'

import { Request, Response } from 'express'
import {
  IController,
  IRequest
} from '../../../data/controllers/controller.interface'

export class ExpressRouterAdapter {
  static adapt(controller: IController) {
    return async (request: Request, response: Response): Promise<void> => {
      const httpRequest: IRequest = {
        body: request.body,
        params: request.params,
        cookies: request.cookies,
        query: request.query,
        headers: request.headers
      }

      Sentry.init({
        dsn: 'https://d7fd7cbcc22a423797df3db664b692f4@o1363137.ingest.sentry.io/6667065',
        tracesSampleRate: 1.0,
        environment: process.env.NODE_ENV
      })

      try {
        const { statusCode, success, message, data } = await controller.execute(
          httpRequest
        )

        response.status(statusCode).json({
          statusCode,
          success,
          message,
          data
        })
      } catch (error: any) {
        if (!error.statusCode) {
          console.error(error)

          Sentry.captureException(error)

          response.status(500).json({
            statusCode: 500,
            success: false,
            message: 'Server Error',
            data: error.data || error.message
          })
          return
        }

        response.status(error.statusCode).json({
          statusCode: error.statusCode,
          success: false,
          message: error.message,
          data: error.data
        })
      }
    }
  }
}
