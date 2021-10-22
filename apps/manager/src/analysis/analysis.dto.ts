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
