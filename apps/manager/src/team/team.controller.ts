import { Controller, Get } from '@nestjs/common';
import { TeamService } from './team.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('team')
@Controller()
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get('api/teams')
  getHello(): string {
    return this.teamService.getHello();
  }
}
