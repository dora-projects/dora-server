import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ description: '项目名' })
  name: string;

  @ApiProperty({ description: '类型' })
  type: string;

  @ApiProperty({ description: '团队 id' })
  teamId: number;
}

export class UpdateProjectDto {
  @ApiProperty({ description: '项目 id' })
  projectId: number;

  @ApiProperty({ description: '团队名字' })
  name: string;

  @ApiProperty({ description: '类型' })
  type: string;
}
