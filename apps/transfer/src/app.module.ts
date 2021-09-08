import { Module } from '@nestjs/common';

import { ReportModule } from './report/report.module';
import { MyConfigModule } from 'libs/shared/config';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [MyConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          redis: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
          },
        };
      },
      inject: [ConfigService],
    }),
    MyConfigModule,
    ReportModule,
  ],
})
export class AppModule {}
