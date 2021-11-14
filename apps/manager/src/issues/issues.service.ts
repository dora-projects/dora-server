import { Injectable } from '@nestjs/common';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Issue } from 'libs/datasource';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Between, Repository } from 'typeorm';

@Injectable()
export class IssuesService {
  constructor(
    @InjectConnection()
    private connection: Connection,

    @InjectRepository(Issue)
    private readonly issueRepository: Repository<Issue>,
  ) {}

  async list(
    params: IPaginationOptions & {
      appKey: string;
      release: string;
      environment: string;
      from: number;
      to: number;
    },
  ): Promise<Pagination<Issue>> {
    const { appKey, release, environment, from, to } = params;

    const queryBuilder = this.issueRepository.createQueryBuilder('issue');
    queryBuilder.orderBy('issue.recently', 'DESC');
    queryBuilder.where({
      appKey: appKey,
      recently: Between(new Date(+from), new Date(+to)),
    });

    if (release) queryBuilder.andWhere({ release });
    if (environment) queryBuilder.andWhere({ release });

    const { limit, page } = params;
    return paginate<Issue>(queryBuilder, { limit, page });
  }
}
