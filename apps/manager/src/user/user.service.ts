import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, UpdateResult, Connection } from 'typeorm';
import { Project, User, UserDashboard } from 'libs/datasource/db/entity';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class UserService {
  constructor(
    @InjectConnection()
    private connection: Connection,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(UserDashboard)
    private readonly dashboardRepository: Repository<UserDashboard>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.username = createUserDto.username;
    user.email = createUserDto.email;
    // todo 密码加密
    user.password = createUserDto.password;

    return await this.userRepository.save(user);
  }

  async countUser(): Promise<number> {
    return await this.userRepository.createQueryBuilder().getCount();
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<User>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder.orderBy('user.createdAt', 'DESC');
    return paginate<User>(queryBuilder, options);
  }

  async findOne(id: string): Promise<User> {
    return await this.userRepository.findOne(id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async searchUser(searchStr: string): Promise<User[]> {
    return await this.userRepository.find({
      where: [
        { username: Like(`%${searchStr}%`) },
        { email: Like(`%${searchStr}%`) },
      ],
    });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    const { username, password, email } = updateUserDto;
    return await this.userRepository.update(
      { id },
      { username, password, email },
    );
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async getDashboardSetting(userId: number) {
    const dashboard = await this.dashboardRepository
      .createQueryBuilder('dashboard')
      .leftJoinAndSelect('dashboard.user', 'user')
      .leftJoinAndSelect('dashboard.project', 'project')
      .where('user.id = :id', { id: userId })
      .getOne();

    if (dashboard?.project) {
      return dashboard?.project;
    }

    // 默认返回第一个
    return await this.projectRepository
      .createQueryBuilder()
      .relation(User, 'projects')
      .of(userId)
      .loadOne();
  }

  async updateDashboardSetting(userId: number, projectId: number) {
    const dashboard = await this.getDashboardSetting(userId);
    const user = await this.userRepository.findOne(userId);
    const project = await this.projectRepository.findOne(projectId);

    if (dashboard && user && project) {
      // update
      return await this.dashboardRepository
        .createQueryBuilder()
        .update(dashboard)
        .set({ user, project })
        .execute();
    }

    // create
    return await this.dashboardRepository
      .createQueryBuilder()
      .insert()
      .into(UserDashboard)
      .values({
        user,
        project,
      })
      .execute();
  }
}
