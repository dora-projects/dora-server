import { Injectable } from '@nestjs/common';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Issue } from 'libs/datasource';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';

@Injectable()
export class IssuesService {
  constructor(
    @InjectConnection()
    private connection: Connection,

    @InjectRepository(Issue)
    private readonly issueRepository: Repository<Issue>,
  ) {}

  async list(appKey, options: IPaginationOptions): Promise<Pagination<Issue>> {
    const queryBuilder = this.issueRepository.createQueryBuilder('issue');
    queryBuilder.orderBy('issue.recently', 'DESC');
    queryBuilder.where({
      appKey: appKey,
    });
    return paginate<Issue>(queryBuilder, options);
  }
}
