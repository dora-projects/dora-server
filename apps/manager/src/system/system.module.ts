import { Module } from '@nestjs/common';

import { SystemController } from './system.controller';
import { SystemService } from './system.service';
import { MyElasticModule } from 'libs/datasource/elasticsearch';

@Module({
  imports: [MyElasticModule],
  controllers: [SystemController],
  providers: [SystemService],
})
export class SystemModule {}
