import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({ description: '团队名字' })
  name: string;
}

export class UpdateTeamDto {
  @ApiProperty({ description: '团队 id' })
  @IsNumber()
  teamId: number;

  @ApiProperty({ description: '团队名字' })
  @IsString()
  name: string;
}

export class JoinTeamDto {
  @ApiProperty({ description: '团队 id' })
  @IsNumber()
  teamId: number;

  @ApiProperty({ description: '用户 id' })
  @IsNumber()
  userId: number;
}

export class TeamProjectDto {
  @ApiProperty({ description: '团队 id' })
  @IsNumber()
  teamId: number;

  @ApiProperty({ description: '项目 id' })
  @IsNumber()
  projectId: number;
}
