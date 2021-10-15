import { Controller, Get } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('issues')
@Controller()
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Get('api/issues')
  getHello(): string {
    return this.issuesService.getHello();
  }
}
