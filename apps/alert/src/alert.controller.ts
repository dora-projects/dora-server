import { Controller, Get } from '@nestjs/common';
import { AlertService } from './alert.service';

@Controller()
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Get()
  getHello(): string {
    return this.alertService.getHello();
  }
}
