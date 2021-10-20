import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString, Length } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ description: '项目名' })
  @IsString()
  @Length(2, 30)
  name: string;

  @ApiProperty({ description: '描述' })
  @IsString()
  @Length(0, 500)
  detail: string;

  @ApiProperty({ description: '类型' })
  @IsString()
  @Length(0, 10)
  type: string;
}

export class UpdateProjectDto {
  @ApiProperty({ description: '项目 id' })
  @IsNumber()
  id: number;

  @ApiProperty({ description: '团队名字' })
  @IsString()
  @Length(2, 30)
  name: string;

  @ApiProperty({ description: '描述' })
  @IsString()
  @Length(0, 500)
  detail: string;

  @ApiProperty({ description: '类型' })
  @IsString()
  @Length(0, 10)
  type: string;
}

export class JoinProjectDto {
  @ApiProperty({ description: '项目 id' })
  @IsNumber()
  projectId: number;

  @ApiProperty({ description: '用户 id' })
  @IsArray()
  userIds: number[];
}
