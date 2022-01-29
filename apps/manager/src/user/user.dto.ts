import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsEmail,
  IsString,
  MaxLength,
  IsOptional,
  IsAlphanumeric,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: '用户名' })
  @MaxLength(14)
  @IsAlphanumeric()
  username: string;

  @ApiProperty({ description: '邮箱' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '密码' })
  @IsString()
  password: string;
}

export class UpdateUserDto {
  @ApiProperty({ description: '用户 id' })
  @IsNumber()
  id: number;

  @ApiProperty({ description: '用户名' })
  @MaxLength(14)
  @IsAlphanumeric()
  username: string;

  @ApiProperty({ description: '邮箱' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '密码' })
  @IsString()
  @IsOptional()
  password: string;
}

export class UserConfigDto {
  @ApiProperty({ description: '项目 id' })
  @IsNumber()
  projectId: number;
}
