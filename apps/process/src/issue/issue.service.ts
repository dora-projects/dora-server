import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as lodash from 'lodash';
import { Repository } from 'typeorm';
import { Project, Issue } from 'libs/datasource';

@Injectable()
export class IssueService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Issue)
    private readonly issueRepository: Repository<Issue>,
  ) {}

  private readonly logger = new Logger(IssueService.name);

  async createIssueIfNotExist(event): Promise<void> {
    const { appKey, fingerprint, release, environment, timestamp } = event;
    const url = lodash.get(event, 'request.url');

    const item = await this.issueRepository.findOne({
      where: { appKey, fingerprint },
    });

    // update
    if (item) {
      await this.issueRepository.update(
        {
          appKey,
          fingerprint,
        },
        {
          url,
          recently: new Date(timestamp),
          total: ++item.total,
        },
      );
    } else {
      // create
      const type = lodash.get(event, 'exception.values[0].type');
      const value = lodash.get(event, 'exception.values[0].value');

      const issue = new Issue();
      issue.appKey = appKey;
      issue.fingerprint = fingerprint;
      issue.type = type;
      issue.value = value;
      issue.environment = environment;
      issue.release = release;
      issue.url = url;
      issue.total = 1;
      issue.recently = new Date(timestamp);
      await this.issueRepository.save(issue);
    }
  }
}
