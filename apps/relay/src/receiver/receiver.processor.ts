import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Processor('event')
export class ReceiverProcessor {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  private readonly logger = new Logger(ReceiverProcessor.name);

  @Process('event-report')
  async handleTranscode(job: Job) {
    try {
      this.logger.debug('Elasticsearch Save...');
      const res = await this.elasticsearchService.index({
        index: 'bastion-test',
        body: job.data,
        pretty: true,
      });
      this.logger.debug(job.data);
      this.logger.debug(
        `Elasticsearch completed, statusCode:${res.statusCode}`,
      );
    } catch (e) {
      this.logger.error(e);
      await job.moveToFailed({ message: e?.message }, true);
    }
  }
}
