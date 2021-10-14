import { Module } from '@nestjs/common';
import { AlertService } from './alert.service';

@Module({
  imports: [],
  providers: [AlertService],
})
export class AlertModule {}
