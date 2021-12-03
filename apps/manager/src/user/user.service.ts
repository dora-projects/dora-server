import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { hashPassword } from 'libs/shared/auth';
import { User, USER_ROLE } from '@prisma/client';
import { PrismaService } from 'libs/datasource/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const count = await this.countUser();

    const hashPwd = await hashPassword(createUserDto.password);

    return await this.prismaService.user.create({
      data: {
        username: createUserDto.username,
        email: createUserDto.email,
        password: hashPwd,
        role: count > 0 ? USER_ROLE.user : USER_ROLE.admin,
      },
    });
  }

  async update(updateUserDto: UpdateUserDto): Promise<User> {
    const newData: any = {
      username: updateUserDto.username,
      email: updateUserDto.email,
    };

    // 密码加密
    if (updateUserDto.password) {
      newData.password = await hashPassword(updateUserDto.password);
    }

    return await this.prismaService.user.update({
      where: { id: updateUserDto.id },
      data: newData,
    });
  }

  async deleteUser(id: number): Promise<User> {
    return await this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }

  async countUser(): Promise<number> {
    return await this.prismaService.user.count();
  }

  async userList(options: { page: number; limit: number }): Promise<User[]> {
    const { page, limit } = options;
    return await this.prismaService.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findOne(id: number): Promise<User> {
    return await this.prismaService.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.prismaService.user.findUnique({
      where: { email },
    });
  }

  async searchUser(searchStr: string): Promise<User[]> {
    if (!searchStr) {
      return await this.prismaService.user.findMany();
    }
    return await this.prismaService.user.findMany({
      where: {
        OR: [
          {
            username: {
              contains: searchStr,
            },
          },
          {
            email: {
              contains: searchStr,
            },
          },
        ],
      },
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
