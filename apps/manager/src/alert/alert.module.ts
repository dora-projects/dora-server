import { Module } from '@nestjs/common';
import { AlertController } from './alert.controller';
import { AlertService } from './alert.service';
import { PrismaService } from 'libs/datasource';

@Module({
  controllers: [AlertController],
  providers: [AlertService, PrismaService],
  exports: [AlertService],
})
export class AlertModule {}
