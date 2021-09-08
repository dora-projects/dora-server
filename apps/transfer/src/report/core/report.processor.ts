import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Processor('event')
export class ReportProcessor {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  private readonly logger = new Logger(ReportProcessor.name);

  @Process('event-report')
  async handleTranscode(job: Job) {
    try {
      this.logger.debug('Elasticsearch Save...');
      const res = await this.elasticsearchService.index({
        index: 'bastion-test',
        body: job.data,
        pretty: true,
      });
      this.logger.log(res.statusCode);
      this.logger.debug('Elasticsearch completed');
    } catch (e) {
      this.logger.error(e);
    }
  }
}
