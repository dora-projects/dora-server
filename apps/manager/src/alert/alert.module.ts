import { Module } from '@nestjs/common';
import { AlertController } from './alert.controller';
import { AlertService } from './alert.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertContact, AlertLog, AlertRule } from 'libs/datasource';

@Module({
  imports: [TypeOrmModule.forFeature([AlertRule, AlertLog, AlertContact])],
  controllers: [AlertController],
  providers: [AlertService],
  exports: [AlertService],
})
export class AlertModule {}
