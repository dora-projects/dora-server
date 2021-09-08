import { TypeOrmModule } from '@nestjs/typeorm';
import { MyConfigModule } from 'libs/shared/config';
import { ConfigService } from '@nestjs/config';

import { User } from './user.entity';

export const database = TypeOrmModule.forRootAsync({
  imports: [MyConfigModule],
  useFactory: (configService: ConfigService) => ({
    type: configService.get<'postgres' | 'mysql'>('TYPEORM_CONNECTION'),

    host: configService.get<string>('TYPEORM_HOST'),
    port: configService.get<number>('TYPEORM_PORT'),

    username: configService.get<string>('TYPEORM_USERNAME'),
    password: configService.get<string>('TYPEORM_PASSWORD'),
    database: configService.get<string>('TYPEORM_DATABASE'),

    autoLoadEntities: true,
    entities: [User],
    synchronize: true,
  }),
  inject: [ConfigService],
});
