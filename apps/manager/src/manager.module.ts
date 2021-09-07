import { Module } from '@nestjs/common';
import { ManagerController } from './manager.controller';
import { ManagerService } from './manager.service';
import { DatasourceModule } from 'libs/datasource';

@Module({
  imports: [DatasourceModule],
  controllers: [ManagerController],
  providers: [ManagerService],
})
export class ManagerModule {}
