import { ExtractJobsUseCase } from '../usecases/extract-jobs.usecase'
import { ExtractJobsController } from '../controllers/implementations/extract-jobs.controller'
import { IController } from '../controllers/controller.interface'

export class ExtractJobsComposer {
  public static compose(): IController {
    const extractJobsUseCase = new ExtractJobsUseCase()
    const extractJobsController = new ExtractJobsController(extractJobsUseCase)
    return extractJobsController
  }
}
