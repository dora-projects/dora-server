import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('api/users')
  getHello(): string {
    return this.userService.getHello();
  }

  @Get('api/userinfo')
  getUserInfo(): string {
    return this.userService.getHello();
  }
}
