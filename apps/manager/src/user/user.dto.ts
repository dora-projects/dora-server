import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: '用户名' })
  @IsAlphanumeric()
  @MaxLength(14)
  username: string;

  @ApiProperty({ required: false, description: '邮箱' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '密码' })
  @IsString()
  password: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UpdateDashboardDto {
  @ApiProperty({ description: '项目 id' })
  @IsNumber()
  projectId: number;
}
