import { IHttpResponse } from '../protocols/http-response'

export interface IRequest {
  body?: any
  params?: any
  query?: any
  cookies?: any
  context?: any
  headers?: any
}

export interface IController {
  execute(request: IRequest): Promise<IHttpResponse>
}
