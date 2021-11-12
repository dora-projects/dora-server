import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterUserDto } from './auth.dto';
import { verifyPassword } from 'libs/shared/auth';

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
}
