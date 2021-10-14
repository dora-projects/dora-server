import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamDto {
  @ApiProperty({ description: '团队名字' })
  name: string;
}

export class UpdateTeamDto {
  @ApiProperty({ description: '团队 id' })
  teamId: number;

  @ApiProperty({ description: '团队名字' })
  name: string;
}

export class JoinTeamDto {
  @ApiProperty({ description: '团队 id' })
  teamId: number;

  @ApiProperty({ description: '用户 id' })
  userId: number;
}

export class TeamProjectDto {
  @ApiProperty({ description: '团队 id' })
  teamId: number;

  @ApiProperty({ description: '项目 id' })
  projectId: number;
}

export class TeamIdDto {
  @ApiProperty({ description: '团队 id' })
  teamId: number;
}
