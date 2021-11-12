import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { UserService } from './user/user.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly userService: UserService) {}

  private readonly logger = new Logger(AppService.name);

  async onModuleInit() {
    console.log('');
  }
}
