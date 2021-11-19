import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Like, Repository, UpdateResult } from 'typeorm';
import { Project, Role, Setting, User } from 'libs/datasource/db/entity';
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
    const count = await this.countUser();
    const user = new User();
    user.username = createUserDto.username;
    user.email = createUserDto.email;
    // 密码加密
    user.password = await hashPassword(createUserDto.password);

    // 第一个用户为 admin
    user.role = count > 0 ? Role.User : Role.Admin;

    return await this.userRepository.save(user);
  }

  async update(updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    const newData: any = {
      username: updateUserDto.username,
      email: updateUserDto.email,
    };

    // 密码加密
    if (updateUserDto.password) {
      newData.password = await hashPassword(updateUserDto.password);
    }

    return await this.userRepository.update({ id: updateUserDto.id }, newData);
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.softDelete(id);
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

  // async getSettingOrDefault(userId: number) {
  //   const setting = await this.getSetting(userId);
  //   if (setting?.project) return setting;
  //
  //   return {
  //     id: null,
  //     user: null,
  //   } as Setting;
  // }
  //
  // async getSetting(userId: number) {
  //   return await this.settingRepository
  //     .createQueryBuilder('setting')
  //     .leftJoinAndSelect('setting.user', 'user')
  //     .leftJoinAndSelect('setting.project', 'project')
  //     .where('user.id = :id', { id: userId })
  //     .getOne();
  // }
  //
  // async updateSetting(userId: number, projectId: number) {
  //   const setting = await this.getSetting(userId);
  //   const user = await this.userRepository.findOne(userId);
  //   const project = await this.projectRepository.findOne(projectId);
  //
  //   if (setting && user && project) {
  //     // update
  //     return await this.settingRepository
  //       .createQueryBuilder()
  //       .update(setting)
  //       .set({ user, project })
  //       .execute();
  //   }
  //
  //   // create
  //   return await this.settingRepository
  //     .createQueryBuilder()
  //     .insert()
  //     .into(Setting)
  //     .values({
  //       user,
  //       project,
  //     })
  //     .execute();
  // }
}
