import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { UserService } from './user/user.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly userService: UserService) {}

  private readonly logger = new Logger(AppService.name);

  async onModuleInit() {
    const total = await this.userService.countUser();
    if (total > 0) {
      return;
    }
    const adminUser = {
      username: 'dora',
      email: 'admin@admin.com',
      password: '123',
    };
    await this.userService.create(adminUser);
    this.logger.log(`admin user has been created!`);
    this.logger.log(adminUser);
  }
}
