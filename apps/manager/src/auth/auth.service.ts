import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterUserDto } from './auth.dto';
import { verifyPassword } from 'libs/shared/auth';
import { User, USER_ROLE } from '@prisma/client';
import { PrismaService } from 'libs/datasource/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const verify = await verifyPassword(pass, user?.password);
    if (verify) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // 签发 jwt 令牌
  async login(user: { email: string; password: string }) {
    const result = await this.usersService.findByEmail(user.email);
    const payload = { result };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  // 注册
  async register(user: RegisterUserDto) {
    return await this.usersService.create(user);
  }

  async findUser(email: string): Promise<User> {
    return await this.usersService.findByEmail(email);
  }

  async findUserAndUpdateLastLogin(email: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user?.id) return null;
    await this.usersService.updateLastLogin(user.id);
    return user;
  }
}
