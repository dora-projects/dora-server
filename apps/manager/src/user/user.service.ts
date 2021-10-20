import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, UpdateResult } from 'typeorm';
import { User, UserDashboard } from 'libs/datasource/db/entity';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(UserDashboard)
    private readonly dashboardRepository: Repository<UserDashboard>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.username = createUserDto.username;
    user.email = createUserDto.email;
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
    return await this.userRepository
      .createQueryBuilder()
      .relation(User, 'dashboard')
      .of(userId)
      .loadOne<UserDashboard>();
  }

  async updateDashboardSetting(userId: number, projectId: number) {
    const dashboard = new UserDashboard();

    await this.dashboardRepository
      .createQueryBuilder()
      .relation(UserDashboard, 'user')
      .of(dashboard)
      .set(userId);

    await this.dashboardRepository
      .createQueryBuilder()
      .relation(UserDashboard, 'project')
      .of(dashboard)
      .set(projectId);
  }
}
