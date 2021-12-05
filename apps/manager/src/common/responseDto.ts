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

export class PaginationRes<T> {
  @ApiProperty({ description: '数据' })
  items: T[];
  @ApiProperty({ description: '页码' })
  page: number;
  @ApiProperty({ description: '单页条数' })
  limit: number;
}
