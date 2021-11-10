import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  async createIssue(): Promise<string> {
    return '';
  }
}
