import { TypeOrmModule } from '@nestjs/typeorm';
import { MyConfigModule } from 'libs/datasource/config';
import { ConfigService } from '@nestjs/config';

import {
  AlertContact,
  AlertRule,
  AlertLog,
  Issue,
  IssueStatus,
  Project,
  Setting,
  User,
  ProjectRoles,
} from './entity';

export const MyDatabase = TypeOrmModule.forRootAsync({
  imports: [MyConfigModule],
  useFactory: (configService: ConfigService) => ({
    type: configService.get<'postgres' | 'mysql'>('typeorm.connection'),

    host: configService.get<string>('typeorm.host'),
    port: configService.get<number>('typeorm.port'),

    username: configService.get<string>('typeorm.username'),
    password: configService.get<string>('typeorm.password'),
    database: configService.get<string>('typeorm.db'),

    // logging: ['error'],

    autoLoadEntities: true,
    entities: [
      AlertContact,
      AlertRule,
      AlertLog,
      Issue,
      IssueStatus,
      Project,
      ProjectRoles,
      Setting,
      User,
    ],
    synchronize: true,
  }),
  inject: [ConfigService],
});
