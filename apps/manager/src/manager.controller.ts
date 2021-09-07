import { Controller, Get } from '@nestjs/common';
import { ManagerService } from './manager.service';

@Controller()
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @Get()
  getHello(): string {
    return this.managerService.getHello();
  }
}
