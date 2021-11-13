import {
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);

  async onModuleInit() {
    console.log('');
  }
}

@Injectable()
export class AppShutdownService implements OnApplicationShutdown {
  private readonly logger = new Logger(AppShutdownService.name);

  onApplicationShutdown(signal: string) {
    console.log();
    this.logger.log(`Received signal:${signal}`);
    this.logger.log('App exit！');
  }
}
