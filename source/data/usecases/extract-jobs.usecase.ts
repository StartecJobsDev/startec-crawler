import axios from 'axios'

import * as cheerio from 'cheerio'
import { CheerioAPI } from 'cheerio/lib/load'
import { Cheerio } from 'cheerio/lib/cheerio'
import { Job } from '../../domain/models/job'
import { IExtractJobsDTO } from '../../domain/dto/job'
import { IHttpResponse } from '../protocols/http-response'
import { HttpResponse } from '../../presentation/helpers/http-response'

export class ExtractJobsUseCase {
  async execute(data: IExtractJobsDTO): Promise<IHttpResponse<Job[]>> {
    const jobs: Job[] = []

    // fetch rootUrl
    const $rootUrlHTML = await this.extractUrl(data.rootUrl)

    // get companyProps
    const companyData = $rootUrlHTML('#__NEXT_DATA__').html()
    const companyProps = JSON.parse(companyData)

    // get job elements
    const jobElements = $rootUrlHTML('#job-listing > ul > li')

    // map jobs data
    for (const element of jobElements) {
      const job = await this.mapJobs(
        element,
        companyProps,
        $rootUrlHTML,
        data.rootUrl
      )
      jobs.push(job)
    }

    return HttpResponse.ok('Jobs extracted successfully', jobs)
  }

  async mapJobs(
    jobElement: Element,
    companyProps: JSON,
    $rootUrlHTML: CheerioAPI,
    rootUrl: string
  ): Promise<Job> {
    const title = $rootUrlHTML(jobElement)
      .find('a > div > div.sc-cc6aad61-5.gKFkBn')
      .text()

    const type = $rootUrlHTML(jobElement)
      .find('a > div > div.sc-cc6aad61-7.kOpdJ')
      .text()

    const location = $rootUrlHTML(jobElement)
      .find('a > div > div.sc-cc6aad61-6.bhyeAN')
      .text()

    let url = $rootUrlHTML(jobElement).find('a').attr('href')

    if (url.length > 0 && url.slice(0, 1) === '/') {
      url = `${rootUrl}${url}`
    }

    const $jobUrlHTML = await this.extractUrl(url)

    // get jobProps
    const jobData = $jobUrlHTML('#__NEXT_DATA__').html()
    const jobProps = JSON.parse(jobData)

    const model = $jobUrlHTML(
      '#main > div > div.sc-310df1f0-0.eTRPxv > div.sc-310df1f0-2.sc-310df1f0-3.eaIkLp.lgEIfQ > p:nth-child(2) > span'
    ).text()

    const jobDescriptionElements = $jobUrlHTML(
      '#main > div > section:nth-child(4) > div'
    )

    const jobDescription = this.mapJobDescription(
      jobDescriptionElements,
      $jobUrlHTML
    )

    const job = {
      title,
      type,
      location,
      model,
      description: jobDescription.description,
      attributions: jobDescription.attributions,
      requirements: jobDescription.requirements,
      additional: jobDescription.additional,
      url,
      rootUrl,
      companyProps,
      jobProps
    }

    return job
  }

  mapJobDescription(
    jobDescriptionElements: Cheerio<Element>,
    $jobUrlHTML: CheerioAPI
  ): any {
    const jobDescription = {
      description: '',
      attributions: '',
      requirements: '',
      additional: ''
    }

    for (let i = 1; i <= jobDescriptionElements.length; i++) {
      const text = jobDescriptionElements
        .find(`div:nth-child(${i}) > div`)
        .contents()
        .map((_: any, element: any) => $jobUrlHTML(element).text())
        .get()
        .join('\n')

      switch (i) {
        case 1:
          jobDescription.description = text
          break
        case 2:
          jobDescription.attributions = text
          break
        case 3:
          jobDescription.requirements = text
          break
        case 4:
          jobDescription.additional = text
          break
      }
    }

    return jobDescription
  }

  async extractUrl(url: string): Promise<CheerioAPI> {
    const res = await axios.get(url)

    const $ = cheerio.load(res.data)

    return $
  }
}
