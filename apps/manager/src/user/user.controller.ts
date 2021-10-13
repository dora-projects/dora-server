import { Body, Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'libs/datasource';

@ApiTags('user')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('api/users')
  getUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('api/user/:id')
  getUser(@Param('id') id: string): Promise<User | undefined> {
    return this.userService.findOne(id);
  }
}
