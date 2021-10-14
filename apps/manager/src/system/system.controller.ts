import { Controller, Get, Ip, Logger, Post, Req } from '@nestjs/common';
import { SystemService } from './system.service';

@Controller()
export class SystemController {
  private readonly logger = new Logger(SystemController.name);

  constructor(private readonly reportService: SystemService) {}

  @Get('api/system/elastic/stats')
  async getElasticStats(): Promise<any> {
    return {
      index: 0,
      mem: 0,
      usage: 0,
    };
  }

  @Get('api/system/bull/jobs')
  async getCounts(): Promise<any> {
    return await this.reportService.getJobCounts();
  }

  @Get('api/system/bull/jobs')
  async getJobs(): Promise<any> {
    return await this.reportService.getJobs();
  }
}
