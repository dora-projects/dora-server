import { ForbiddenException, Injectable } from '@nestjs/common';
import * as assert from 'assert';
import { v4 as uuid } from 'uuid';
import { CreateProjectDto, UpdateProjectDto } from './project.dto';
import { PrismaService } from 'libs/datasource/prisma.service';
import { Project, PROJECT_ROLE } from '@prisma/client';
import { BadRequestException } from '../common/error';

@Injectable()
export class ProjectService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createProjectDto: CreateProjectDto,
    userId: number,
  ): Promise<Project | void> {
    assert(!!userId);
    try {
      return await this.prismaService.project.create({
        data: {
          name: createProjectDto.name,
          type: createProjectDto.type,
          detail: createProjectDto.detail,
          appKey: uuid().replace(/-/g, ''),
          user_projects: {
            create: {
              userId: userId,
              prole: PROJECT_ROLE.owner,
            },
          },
        },
      });
    } catch (e) {
      if (e?.code === 'P2002') {
        throw new BadRequestException('项目名已存在');
      }
      throw e;
    }
  }

  async update(updateProjectDto: UpdateProjectDto): Promise<Project> {
    const { id, name, type, detail } = updateProjectDto;
    return await this.prismaService.project.update({
      where: { id },
      data: { name, type, detail },
    });
  }

  async findById(id: number): Promise<any> {
    return await this.prismaService.project.findUnique({ where: { id } });
  }

  async findByAppKey(appKey: string): Promise<Project> {
    return await this.prismaService.project.findUnique({ where: { appKey } });
  }

  async delete(projectId: number): Promise<Project> {
    return await this.prismaService.project.delete({
      where: {
        id: projectId,
      },
    });
  }

  async findUserProjects(userId: number): Promise<Project[]> {
    return await this.prismaService.project.findMany({
      where: {
        user_projects: {
          some: {
            userId: userId,
          },
        },
      },
    });
  }

  async findProjectUsers(projectId: number): Promise<any[]> {
    return await this.prismaService.user.findMany({
      where: {
        user_projects: {
          some: {
            projectId: projectId,
          },
        },
      },
      select: {
        username: true,
        email: true,
        id: true,
        user_projects: {
          where: {
            projectId: projectId,
          },
        },
      },
    });
  }

  async projectAddUsers(
    projectId: number,
    userIds: number[],
    projectRole = PROJECT_ROLE.developer,
  ) {
    const data: { userId: number; prole: PROJECT_ROLE }[] = [];
    for (const userId of userIds) {
      data.push({ userId: userId, prole: projectRole });
    }
    return await this.prismaService.project.update({
      where: {
        id: projectId,
      },
      data: {
        user_projects: {
          createMany: {
            data,
          },
        },
      },
    });
  }

  async projectRemoveUser(projectId: number, userId: number) {
    return await this.prismaService.project.update({
      where: {
        id: projectId,
      },
      data: {
        user_projects: {
          deleteMany: [{ userId }],
        },
      },
    });
  }

  async findProjectRoles(userId: number, projectId: number) {
    return await this.prismaService.userProjects.findFirst({
      where: {
        userId: userId,
        projectId: projectId,
      },
    });
  }

  async requireProjectRole(
    userId: number,
    projectId: number,
    role: PROJECT_ROLE,
  ) {
    const result = await this.findProjectRoles(userId, projectId);
    if (result?.prole !== role) {
      throw new ForbiddenException();
    }
  }

  async isUserCanAccessProject(
    appKey: string,
    userId: number,
  ): Promise<boolean> {
    const projects = await this.findUserProjects(userId);
    if (!projects || projects.length === 0) return false;
    const project = projects.some((project) => {
      return project.appKey === appKey;
    });
    return !!project;
  }
}
