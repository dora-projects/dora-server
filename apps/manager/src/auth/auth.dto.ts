import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ required: true, description: '邮箱' })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true, description: '密码' })
  @IsString()
  password: string;
}

export class RegisterUserDto {
  @ApiProperty({ required: false, description: '邮箱' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '密码' })
  @IsString()
  password: string;
}
