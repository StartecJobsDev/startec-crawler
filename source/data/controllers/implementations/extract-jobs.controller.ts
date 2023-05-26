import { IExtractJobsUseCase } from '../../../domain/usecases/extract-jobs'
import { IHttpResponse } from '../../protocols/http-response'
import { IController, IRequest } from '../controller.interface'

export class ExtractJobsController implements IController {
  constructor(private readonly extractJobsUseCase: IExtractJobsUseCase) {}

  async execute(httpRequest: IRequest): Promise<IHttpResponse> {
    const { body } = httpRequest

    const jobs = await this.extractJobsUseCase.execute(body)

    return jobs
  }
}
