import { Injectable } from '@nestjs/common';
import * as assert from 'assert';
import { Project, User } from 'libs/datasource';
import {
  Connection,
  QueryFailedError,
  Repository,
  UpdateResult,
} from 'typeorm';
import { InjectRepository, InjectConnection } from '@nestjs/typeorm';
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
      project.appKey = uuid().replaceAll('-', '');

      const result = await this.projectRepository.save(project);
      await this.projectAddUser(result.id, [userId]);
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
      .delete()
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
    return await this.projectRepository
      .createQueryBuilder()
      .relation(Project, 'users')
      .of(projectId)
      .loadMany();
  }

  async projectAddUser(projectId: number, userIds: number[]) {
    return await this.projectRepository
      .createQueryBuilder()
      .relation(Project, 'users')
      .of(projectId)
      .add(userIds);
  }

  async projectRemoveUser(projectId: number, userIds: number[]) {
    return await this.projectRepository
      .createQueryBuilder()
      .relation(Project, 'users')
      .of(projectId)
      .remove(userIds);
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
