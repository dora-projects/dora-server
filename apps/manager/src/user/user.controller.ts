import { Body, Controller, Post, Get, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiQuery, ApiBody, ApiTags } from '@nestjs/swagger';
import { User } from 'libs/datasource';
import { CreateUserDto } from './user.dto';

@ApiTags('user')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBody({ type: CreateUserDto })
  @Post('api/user/create')
  async createUser(@Body() user: CreateUserDto): Promise<User> {
    return await this.userService.create(user);
  }

  @ApiBody({ type: CreateUserDto })
  @Post('api/user/update')
  async updateUser(@Body() user: CreateUserDto): Promise<User> {
    return await this.userService.create(user);
  }

  @Get('api/users')
  getUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('api/user')
  @ApiQuery({ name: 'id', required: false })
  @ApiQuery({ name: 'email', required: false })
  @ApiQuery({ name: 'username', required: false })
  async queryUser(@Query() query): Promise<{
    result: User[] | User;
  }> {
    const { id, email, username } = query;
    if (id) {
      return { result: await this.userService.findOne(id) };
    }
    if (email) {
      return { result: await this.userService.findByEmail(id) };
    }
    if (username) {
      return { result: await this.userService.searchByUsername(username) };
    }
  }
}
