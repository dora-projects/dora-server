import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ description: '项目名' })
  @MaxLength(30, { message: '项目名最大长度为 $constraint1' })
  name: string;

  @ApiProperty({ description: '详细说明' })
  @MaxLength(500, { message: '描述最大长度为 $constraint1' })
  detail: string;

  @ApiProperty({ description: '类型' })
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
