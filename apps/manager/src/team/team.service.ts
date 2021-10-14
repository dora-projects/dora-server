import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project, Team, User } from 'libs/datasource';
import { Repository, UpdateResult } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { CreateTeamDto, UpdateTeamDto } from './team.dto';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  async paginate(options: IPaginationOptions): Promise<Pagination<Team>> {
    const queryBuilder = this.teamRepository.createQueryBuilder('t');
    queryBuilder.orderBy('t.createdAt', 'DESC');
    return paginate<Team>(queryBuilder, options);
  }

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    const team = new Team();
    team.name = createTeamDto.name;
    return await this.teamRepository.save(team);
  }

  async update(updateTeamDto: UpdateTeamDto): Promise<UpdateResult> {
    const { name, teamId } = updateTeamDto;
    return await this.teamRepository.update({ id: teamId }, { name });
  }

  async teamUsers(teamId: number): Promise<User[]> {
    return await this.teamRepository
      .createQueryBuilder()
      .relation(Team, 'users')
      .of(teamId)
      .loadMany();
  }

  async delete(teamId: number): Promise<void> {
    await this.teamRepository.delete(teamId);
  }

  async joinTeam(teamId: number, userId: number): Promise<void> {
    const user = new User();
    user.id = userId;

    return await this.teamRepository
      .createQueryBuilder()
      .relation(Team, 'users')
      .of(teamId)
      .add(user);
  }

  async leaveTeam(teamId: number, userId: number): Promise<void> {
    const user = new User();
    user.id = userId;

    return await this.teamRepository
      .createQueryBuilder()
      .relation(Team, 'users')
      .of(teamId)
      .remove(user);
  }

  async getTeamProjects(teamId: number): Promise<Project[]> {
    return await this.teamRepository
      .createQueryBuilder()
      .relation(Team, 'projects')
      .of(teamId)
      .loadMany();
  }

  async addTeamProjects(teamId: number, projectId: number): Promise<void> {
    const project = new Project();
    project.id = projectId;

    return await this.teamRepository
      .createQueryBuilder()
      .relation(Team, 'projects')
      .of(teamId)
      .add(project);
  }

  async removeTeamProjects(teamId: number, projectId: number): Promise<void> {
    const project = new Project();
    project.id = projectId;

    return await this.teamRepository
      .createQueryBuilder()
      .relation(Team, 'projects')
      .of(teamId)
      .remove(project);
  }
}
