export interface IHttpResponse<T = any> {
  statusCode: number
  success: boolean
  message?: string
  data: T
}
