import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsEmail, IsString, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ required: true, description: '邮箱' })
  // @IsEmail()
  email: string;

  @ApiProperty({ required: true, description: '密码' })
  @IsString()
  password: string;
}

export class RegisterUserDto {
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
