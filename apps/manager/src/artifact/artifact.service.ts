import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'libs/datasource';
import { PaginationRes } from '../common/responseDto';
import { Artifact } from '@prisma/client';
import { Cache } from 'cache-manager';

@Injectable()
export class ArtifactService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly prismaService: PrismaService,
  ) {}

  async create(data: {
    path: string;
    compressedPath: string;
    release: string;
    author: string;
    authorMail: string;
    gitBranch: string;
    commit: string;
    commitHash: string;
    commitAt: string;
    projectId: number;
  }) {
    const {
      path,
      compressedPath,
      projectId,
      release,
      author,
      authorMail,
      gitBranch,
      commit,
      commitHash,
      commitAt,
    } = data;

    return await this.prismaService.artifact.create({
      data: {
        path,
        compressedPath,
        release,
        author,
        authorMail,
        gitBranch,
        commit,
        commitHash,
        commitAt,
        project: {
          connect: { id: projectId },
        },
      },
    });
  }

  async list(params: {
    projectId: number;
    page: number;
    limit: number;
  }): Promise<PaginationRes<Artifact>> {
    const { projectId, page, limit } = params;

    const cond: any = {
      projectId: projectId,
    };

    const total = await this.prismaService.artifact.count({
      where: cond,
    });
    const list = await this.prismaService.artifact.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: cond,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      items: list,
      page: page,
      limit: limit,
      total,
    };
  }

  async find(artifactId: number): Promise<Artifact> {
    return await this.prismaService.artifact.findUnique({
      where: {
        id: artifactId,
      },
    });
  }

  async createPreview(data: {
    subHost: string;
    release: string;
    hash: string;
    path: string;
  }) {
    const key = data.hash.toLocaleLowerCase();

    // todo
    await this.cacheManager.set(
      `agent:${key}`,
      {
        release: data.release,
        filepath: data.path,
        index: 'index.html',
        proxy: {
          '/manager': 'https://dora.nancode.cn',
        },
      },
      { ttl: 3 * 24 * 60 * 60 },
    );
    return { link: `https://${key}.${data.subHost}` };
  }
}
