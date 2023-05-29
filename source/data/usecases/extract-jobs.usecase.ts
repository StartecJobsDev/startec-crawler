import axios from 'axios'

import * as cheerio from 'cheerio'
import { CheerioAPI } from 'cheerio/lib/load'
import { Job } from '../../domain/models/job'
import { IExtractJobsDTO } from '../../domain/dto/job'
import { IHttpResponse } from '../protocols/http-response'
import { HttpResponse } from '../../presentation/helpers/http-response'

export class ExtractJobsUseCase {
  async execute(data: IExtractJobsDTO): Promise<IHttpResponse<Job[]>> {
    const jobs: Job[] = []

    const $rootUrlHTML = await this.extractUrl(data.rootUrl)

    const companyData = $rootUrlHTML('#__NEXT_DATA__').html()
    const companyProps = JSON.parse(companyData)

    const jobElements = $rootUrlHTML('#job-listing > ul > li')

    for (const element of jobElements) {
      const job = await this.mapJobs(
        element,
        companyProps,
        $rootUrlHTML,
        data.rootUrl
      )
      jobs.push(job)
    }

    return HttpResponse.ok(
      `${jobs.length} job${jobs.length > 1 ? 's' : ''} extracted successfully`,
      jobs
    )
  }

  async mapJobs(
    jobElement: any,
    companyProps: JSON,
    $rootUrlHTML: CheerioAPI,
    rootUrl: string
  ): Promise<Job> {
    let url = $rootUrlHTML(jobElement).find('a').attr('href')

    if (url.length > 0 && url.slice(0, 1) === '/') {
      url = `${rootUrl}${url}`
    }

    const $jobUrlHTML = await this.extractUrl(url)

    const jobData = $jobUrlHTML('#__NEXT_DATA__').html()
    const jobProps = JSON.parse(jobData)

    const title = $jobUrlHTML(
      '#main > div > div.sc-310df1f0-0.eTRPxv > h1'
    ).text()

    const type = $rootUrlHTML(jobElement)
      .find('a > div > div.sc-cc6aad61-7.kOpdJ')
      .text()

    const location = $rootUrlHTML(jobElement)
      .find('a > div > div.sc-cc6aad61-6.bhyeAN')
      .text()

    const model = $jobUrlHTML(
      '#main > div > div.sc-310df1f0-0.eTRPxv > div.sc-310df1f0-2.sc-310df1f0-3.eaIkLp.lgEIfQ > p:nth-child(2) > span'
    ).text()

    const jobDescription = this.mapJobDescription($jobUrlHTML)

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

  mapJobDescription($jobUrlHTML: CheerioAPI): any {
    const elements = [
      {
        label: 'description',
        value: $jobUrlHTML(
          'h2[data-testid="section-Descrição da vaga-title"]'
        ).next('div')
      },
      {
        label: 'attributions',
        value: $jobUrlHTML(
          'h2[data-testid="section-Responsabilidades e atribuições-title"]'
        ).next('div')
      },
      {
        label: 'requirements',
        value: $jobUrlHTML(
          'h2[data-testid="section-Requisitos e qualificações-title"]'
        ).next('div')
      },
      {
        label: 'additional',
        value: $jobUrlHTML(
          'h2[data-testid="section-Informações adicionais-title"]'
        ).next('div')
      }
    ]

    const jobDescription = {
      description: '',
      attributions: '',
      requirements: '',
      additional: ''
    }

    elements.forEach(el => {
      const $el = $jobUrlHTML(el.value)
      $el.find('[style]').removeAttr('style')
      $el.find('br').remove()
      $el.find('a').remove()

      const text = $el.html()

      jobDescription[el.label] = text
    })

    return jobDescription
  }

  async extractUrl(url: string): Promise<CheerioAPI> {
    const res = await axios.get(url)

    const $ = cheerio.load(res.data)

    return $
  }
}
