import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AlertService } from './alert.service';

@ApiTags('alert')
@Controller()
export class AlertController {
  constructor(private readonly analysisService: AlertService) {}

  @Get('api/alert')
  getHello(): string {
    return this.analysisService.getHello();
  }
}
