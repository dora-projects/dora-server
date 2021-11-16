import { ApiProperty } from '@nestjs/swagger';

export class CreateCatDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  age: number;

  @ApiProperty()
  breed: string;
}

export class EqlQueryBody {
  @ApiProperty({ description: '查询体' })
  eql: Record<string, any>;
}

export class RangeParams {
  @ApiProperty({ description: '开始时间' })
  from?: number;
  @ApiProperty({ description: '结束时间' })
  to?: number;
}

export class TrendRangeParams extends RangeParams {
  @ApiProperty({ description: '间隔 eg: 1m、1h' })
  interval: string;
}

export class CommonParams {
  @ApiProperty({ description: '时间类型' })
  type?: string;

  @ApiProperty({ description: '应用标识' })
  appKey?: string;

  @ApiProperty({ description: '发布版本' })
  release?: string;

  @ApiProperty({ description: '环境' })
  environment?: string;
}
