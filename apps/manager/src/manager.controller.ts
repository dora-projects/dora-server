import { Controller, Get } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { DatasourceService } from 'libs/datasource';

@Controller()
export class ManagerController {
  constructor(
    private readonly managerService: ManagerService,
    private readonly datasourceService: DatasourceService,
  ) {}

  @Get()
  getHello(): string {
    return this.datasourceService.getHello();
  }
}
