import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Like, Repository, UpdateResult } from 'typeorm';
import { Project, Setting, User } from 'libs/datasource/db/entity';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { hashPassword } from 'libs/shared/auth';

@Injectable()
export class UserService {
  constructor(
    @InjectConnection()
    private connection: Connection,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.username = createUserDto.username;
    user.email = createUserDto.email;
    // 密码加密
    user.password = await hashPassword(createUserDto.password);

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
    if (!searchStr) {
      return await this.userRepository.find();
    }
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

  async getSettingOrDefault(userId: number) {
    const setting = await this.getSetting(userId);
    if (setting?.project) return setting;

    // 默认提供一个项目展示
    const project = await this.projectRepository
      .createQueryBuilder()
      .relation(User, 'projects')
      .of(userId)
      .loadOne();

    return {
      id: null,
      user: null,
      project: project,
    } as Setting;
  }

  async getSetting(userId: number) {
    return await this.settingRepository
      .createQueryBuilder('setting')
      .leftJoinAndSelect('setting.user', 'user')
      .leftJoinAndSelect('setting.project', 'project')
      .where('user.id = :id', { id: userId })
      .getOne();
  }

  async updateSetting(userId: number, projectId: number) {
    const setting = await this.getSetting(userId);
    const user = await this.userRepository.findOne(userId);
    const project = await this.projectRepository.findOne(projectId);

    if (setting && user && project) {
      // update
      return await this.settingRepository
        .createQueryBuilder()
        .update(setting)
        .set({ user, project })
        .execute();
    }

    // create
    return await this.settingRepository
      .createQueryBuilder()
      .insert()
      .into(Setting)
      .values({
        user,
        project,
      })
      .execute();
  }
}
