import { Injectable } from '@nestjs/common';
import { PrismaService } from 'libs/datasource';
import { PaginationRes } from '../common/responseDto';
import { Artifact } from '@prisma/client';

@Injectable()
export class ArtifactService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: {
    release: string;
    path: string;
    compressedPath: string;
    projectId: number;
  }) {
    const { release, compressedPath, path, projectId } = data;
    return await this.prismaService.artifact.create({
      data: {
        release: release,
        path: path,
        compressedPath: compressedPath,
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
}
