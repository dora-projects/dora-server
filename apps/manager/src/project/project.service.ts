import { Injectable } from '@nestjs/common';
import { Project } from 'libs/datasource';
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

  async create(createProjectDto: CreateProjectDto): Promise<Project | void> {
    const runner = this.connection.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();

    let err;
    try {
      const project = new Project();
      project.name = createProjectDto.name;
      project.type = createProjectDto.type;
      project.apiKey = uuid();
      const result = await runner.manager.save(project);

      await runner.manager
        .createQueryBuilder()
        .relation(Project, 'team')
        .of(project)
        .set(createProjectDto.teamId);

      await runner.commitTransaction();
      return result;
    } catch (e) {
      err = e;
      await runner.rollbackTransaction();
    } finally {
      await runner.release();
    }
    return err;
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

  async update(updateProjectDto: UpdateProjectDto): Promise<UpdateResult> {
    const { projectId, name, type } = updateProjectDto;
    return await this.projectRepository.update(
      { id: projectId },
      { name, type },
    );
  }

  async delete(projectId: number): Promise<void> {
    await this.projectRepository.delete(projectId);
  }
}
