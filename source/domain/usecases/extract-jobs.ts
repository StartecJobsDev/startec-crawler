import { IHttpResponse } from '../../data/protocols/http-response'
import { Job } from '../models/job'
import { IExtractJobsDTO } from '../dto/job'

export interface IExtractJobsUseCase {
  execute(data: IExtractJobsDTO): Promise<IHttpResponse<Job[]>>
}
