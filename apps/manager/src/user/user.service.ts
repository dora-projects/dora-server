import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { hashPassword } from 'libs/shared/auth';
import { User, UserConfig, USER_ROLE } from '@prisma/client';
import { PrismaService } from 'libs/datasource/prisma.service';
import { PaginationRes } from '../common/responseDto';
import { BadRequestException } from '../common/error';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const count = await this.countUser();

    const hashPwd = await hashPassword(createUserDto.password);

    try {
      return await this.prismaService.user.create({
        data: {
          username: createUserDto.email.split('@')[0],
          email: createUserDto.email,
          password: hashPwd,
          role: count > 0 ? USER_ROLE.user : USER_ROLE.admin,
        },
      });
    } catch (e) {
      if (e?.code === 'P2002') {
        throw new BadRequestException('该邮箱已注册');
      }
      throw e;
    }
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

  async userList(options: {
    page: number;
    limit: number;
  }): Promise<PaginationRes<User>> {
    const { page, limit } = options;

    const total = await this.prismaService.user.count();
    const result = await this.prismaService.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      items: result,
      page,
      limit,
      total,
    };
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

  async updateLastLogin(id: number): Promise<User> {
    return await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        lastLoginAt: new Date(),
      },
    });
  }

  async getUserConfig(uid: number): Promise<UserConfig> {
    return this.prismaService.userConfig.findUnique({
      where: {
        userId: uid,
      },
      include: {
        project: true,
      },
    });
  }

  async updateUserConfig(uid: number, projectId: number): Promise<UserConfig> {
    await this.createIfNotExist(uid);
    return this.prismaService.userConfig.update({
      where: {
        userId: uid,
      },
      data: {
        projectId: projectId,
      },
    });
  }

  async createIfNotExist(uid: number): Promise<UserConfig> {
    const cof = await this.getUserConfig(uid);
    if (cof) return cof;

    return this.prismaService.userConfig.create({
      data: {
        userId: uid,
      },
    });
  }
}
