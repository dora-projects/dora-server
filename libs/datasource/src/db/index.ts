import { TypeOrmModule } from '@nestjs/typeorm';
import { MyConfigModule } from 'libs/datasource/config';
import { ConfigService } from '@nestjs/config';

import {
  AlertContact,
  AlertRule,
  Issue,
  IssueStatus,
  Project,
  Team,
  UserDashboard,
  User,
} from './entity';

export const MyDatabase = TypeOrmModule.forRootAsync({
  imports: [MyConfigModule],
  useFactory: (configService: ConfigService) => ({
    type: configService.get<'postgres' | 'mysql'>('TYPEORM_CONNECTION'),

    host: configService.get<string>('TYPEORM_HOST'),
    port: configService.get<number>('TYPEORM_PORT'),

    username: configService.get<string>('TYPEORM_USERNAME'),
    password: configService.get<string>('TYPEORM_PASSWORD'),
    database: configService.get<string>('TYPEORM_DATABASE'),

    logging: ['error'],

    autoLoadEntities: true,
    entities: [
      AlertContact,
      AlertRule,
      Issue,
      IssueStatus,
      Project,
      Team,
      UserDashboard,
      User,
    ],
    synchronize: true,
  }),
  inject: [ConfigService],
});
