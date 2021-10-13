import { Injectable } from '@nestjs/common';
import { Get } from '@nestjs/common';

@Injectable()
export class ProjectService {
  @Get('api/projects')
  getHello(): string {
    return 'Hello !';
  }
}
