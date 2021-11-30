import { ForbiddenException, Injectable } from '@nestjs/common';
import * as assert from 'assert';
import { v4 as uuid } from 'uuid';
import { CreateProjectDto, UpdateProjectDto } from './project.dto';
import { PrismaService } from 'libs/shared/prisma.service';
import { Project, User, PROJECT_ROLE } from '@prisma/client';

@Injectable()
export class ProjectService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createProjectDto: CreateProjectDto,
    userId: number,
  ): Promise<Project | void> {
    assert(!!userId);
    return await this.prismaService.project.create({
      data: {
        name: createProjectDto.name,
        type: createProjectDto.type,
        detail: createProjectDto.detail,
        appKey: uuid().replace(/-/g, ''),
        user_projects: {
          create: {
            userId: userId,
          },
        },
      },
    });
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

  async findProjectUsers(projectId: number): Promise<User[]> {
    return await this.prismaService.user.findMany({
      where: {
        user_projects: {
          some: {
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
    for (const userId of userIds) {
      await this.projectAddUser(projectId, userId, projectRole);
    }
  }

  async projectAddUser(
    projectId: number,
    userId: number,
    projectRole = PROJECT_ROLE.developer,
  ) {
    return await this.prismaService.project.update({
      where: {
        id: projectId,
      },
      data: {
        user_projects: {
          createMany: {
            data: {
              userId,
            },
          },
        },
        project_roles: {
          createMany: {
            data: {
              userId,
              projectRole,
            },
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
        project_roles: {
          deleteMany: { userId },
        },
      },
    });
  }

  async findProjectRole(userId: number, projectId: number) {
    return await this.prismaService.projectRoles.findUnique({
      where: {},
    });
  }

  async requireProjectRole(
    userId: number,
    projectId: number,
    role: PROJECT_ROLE,
  ) {
    const result = await this.findProjectRole(userId, projectId);
    if (result?.projectRole !== role) {
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
