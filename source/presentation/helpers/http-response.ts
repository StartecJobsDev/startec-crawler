import { IHttpResponse } from '../../data/protocols/http-response'

export class HttpResponse {
  static badRequest(error: Error, data?: unknown): IHttpResponse {
    return {
      statusCode: 400,
      success: false,
      message: error.message,
      data: data || {}
    }
  }

  static serverError(error: Error, data?: unknown): IHttpResponse {
    return {
      statusCode: 500,
      success: false,
      message: error.message,
      data: data || {}
    }
  }

  static ok(message: string, data?: unknown): IHttpResponse {
    return {
      statusCode: 200,
      success: true,
      message: message,
      data: data || {}
    }
  }

  static created(message: string, data?: unknown): IHttpResponse {
    return {
      statusCode: 201,
      success: true,
      message: message,
      data: data || {}
    }
  }

  static notFound(error: Error, data?: unknown): IHttpResponse {
    return {
      statusCode: 404,
      success: false,
      message: error.message,
      data: data || {}
    }
  }
}
