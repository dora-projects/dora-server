import { Module } from '@nestjs/common';
import { AlertController } from './alert.controller';
import { AlertService } from './alert.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertContact, AlertRule } from 'libs/datasource';

@Module({
  imports: [TypeOrmModule.forFeature([AlertRule, AlertContact])],
  controllers: [AlertController],
  providers: [AlertService],
})
export class AlertModule {}
