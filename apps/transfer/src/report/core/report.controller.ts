import { Controller, Get, Ip, Logger, Post, Req } from '@nestjs/common';
import { ReportService } from './report.service';

@Controller()
export class ReportController {
  private readonly logger = new Logger(ReportController.name);

  constructor(private readonly eventService: ReportService) {}

  @Get()
  async getCounts(): Promise<any> {
    return await this.eventService.getJobCounts();
  }

  @Get('/jobs')
  async getJobs(): Promise<any> {
    return await this.eventService.getJobs();
  }

  @Post('/report')
  async report(@Ip() ip: string, @Req() req: any): Promise<string> {
    await this.eventService.handleEvent(req.body, ip);
    return 'ok';
  }
}
