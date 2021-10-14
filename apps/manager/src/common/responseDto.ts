import { ApiProperty } from '@nestjs/swagger';

export class SuccessRes {
  @ApiProperty({ description: '是否成功' })
  success?: boolean;
}

export class ErrorRes {
  @ApiProperty({ description: '错误消息' })
  error?: string;
}

export type SuccessOrErrorRes = SuccessRes | ErrorRes;
