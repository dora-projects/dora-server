import { ForbiddenException, Injectable } from '@nestjs/common';
import * as assert from 'assert';
import { Project, ProjectRoleEnum, ProjectRoles, User } from 'libs/datasource';
import {
  Connection,
  QueryFailedError,
  Repository,
  UpdateResult,
} from 'typeorm';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { CreateProjectDto, UpdateProjectDto } from './project.dto';
import { RecordExistException } from '../common/error';

@Injectable()
export class ProjectService {
  constructor(
    @InjectConnection()
    private connection: Connection,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(ProjectRoles)
    private readonly projectRolesRepository: Repository<ProjectRoles>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
    userId: number,
  ): Promise<Project | void> {
    assert(!!userId);

    try {
      const project = new Project();
      project.name = createProjectDto.name;
      project.type = createProjectDto.type;
      project.detail = createProjectDto.detail;

      const u: string = uuid();
      project.appKey = u.replace(/-/g, '');

      const result = await this.projectRepository.save(project);
      await this.projectAddUser(result.id, userId, ProjectRoleEnum.Owner);

      return result;
    } catch (e) {
      if (e instanceof QueryFailedError) {
        throw new RecordExistException('项目名已存在');
      } else {
        throw e;
      }
    }
  }

  async update(updateProjectDto: UpdateProjectDto): Promise<UpdateResult> {
    const { id, name, type, detail } = updateProjectDto;
    return await this.projectRepository.update({ id }, { name, type, detail });
  }

  async findById(id: number): Promise<Project> {
    return await this.projectRepository.findOne({
      where: { id },
    });
  }

  async findByAppKey(appKey: string): Promise<Project> {
    return await this.projectRepository.findOne({
      where: {
        appKey: appKey,
      },
    });
  }

  async delete(projectId: number): Promise<void> {
    await this.projectRepository
      .createQueryBuilder()
      .softDelete()
      .from(Project)
      .where('id = :id', { id: projectId })
      .execute();
  }

  async findUserProjects(userId: number): Promise<Project[]> {
    return await this.projectRepository
      .createQueryBuilder()
      .relation(User, 'projects')
      .of(userId)
      .loadMany();
  }

  async findProjectUsers(projectId: number) {
    const result = await this.projectRepository
      .createQueryBuilder('p')
      .where('p.id = :id', { id: projectId })
      .leftJoinAndSelect('p.users', 'users')
      .leftJoinAndSelect(
        'users.projectRoles',
        'projectRoles',
        'projectRoles.projectId = :id',
        { id: projectId },
      )
      .getOne();
    return result.users;
  }

  async projectAddUsers(
    projectId: number,
    userIds: number[],
    projectRole = ProjectRoleEnum.Developer,
  ) {
    for (const userId of userIds) {
      await this.projectAddUser(projectId, userId, projectRole);
    }
  }

  async projectAddUser(
    projectId: number,
    userId: number,
    projectRole = ProjectRoleEnum.Developer,
  ) {
    await this.projectRepository
      .createQueryBuilder()
      .relation(Project, 'users')
      .of(projectId)
      .add(userId);

    const role = new ProjectRoles();
    role.projectRole = projectRole;
    const newRole = await this.projectRolesRepository.save(role);

    await this.projectRolesRepository
      .createQueryBuilder()
      .relation(ProjectRoles, 'project')
      .of(newRole)
      .set(projectId);

    await this.projectRolesRepository
      .createQueryBuilder()
      .relation(ProjectRoles, 'user')
      .of(newRole)
      .set(userId);
  }

  async projectRemoveUser(projectId: number, userId: number) {
    await this.projectRepository
      .createQueryBuilder()
      .relation(Project, 'users')
      .of(projectId)
      .remove(userId);

    await this.projectRolesRepository
      .createQueryBuilder('projectRoles')
      .where('projectRoles.projectId = :projectId', { projectId: projectId })
      .andWhere('projectRoles.userId = :userId', { userId: userId })
      .delete();
  }

  async findProjectRoles(userId: number, projectId: number) {
    return this.projectRolesRepository
      .createQueryBuilder('pr')
      .where('pr.projectId = :projectId', { projectId })
      .andWhere('pr.userId = :userId', { userId })
      .leftJoinAndSelect('pr.user', 'user')
      .leftJoinAndSelect('pr.project', 'project')
      .getOne();
  }

  async requireProjectRole(
    userId: number,
    projectId: number,
    role: ProjectRoleEnum,
  ) {
    const result = await this.findProjectRoles(userId, projectId);
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
