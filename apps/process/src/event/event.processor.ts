import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Processor('event')
export class EventProcessor {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  private readonly logger = new Logger(EventProcessor.name);

  @Process('event-error')
  async handleErrorMessage(job: Job) {
    try {
      this.logger.debug('process event-error');
      const docIndex = 'dora-error';
      const res = await this.elasticsearchService.index({
        index: docIndex,
        body: job.data,
      });
      this.logger.debug(`elasticsearch save ${docIndex}`, res.body);
    } catch (e) {
      this.logger.error(e);
      await job.moveToFailed({ message: e?.message }, true);
    }
  }

  @Process('event-pref')
  async handlePrefMessage(job: Job) {
    try {
      this.logger.debug('process event-pref');
      const docIndex = 'dora-pref';
      const res = await this.elasticsearchService.index({
        index: docIndex,
        body: job.data,
      });
      this.logger.debug(`elasticsearch save ${docIndex}`, res.body);
    } catch (e) {
      this.logger.error(e);
      await job.moveToFailed({ message: e?.message }, true);
    }
  }
}
