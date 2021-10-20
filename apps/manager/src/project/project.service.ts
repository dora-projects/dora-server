import { Injectable } from '@nestjs/common';
import * as assert from 'assert';
import { Project, User } from 'libs/datasource';
import { Connection, Repository, UpdateResult } from 'typeorm';
import { InjectRepository, InjectConnection } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { CreateProjectDto, UpdateProjectDto } from './project.dto';

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

    const project = new Project();
    project.name = createProjectDto.name;
    project.type = createProjectDto.type;
    project.detail = createProjectDto.detail;
    project.apiKey = uuid();

    const result = await this.projectRepository.save(project);
    await this.projectAddUser(result.id, [userId]);
    return result;
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
        apiKey: appKey,
      },
    });
  }

  async delete(projectId: number): Promise<void> {
    await this.projectRepository.delete(projectId);
  }

  async findLoginUserProjects(userId: number): Promise<Project[]> {
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
}
