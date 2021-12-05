import { ApiProperty } from '@nestjs/swagger';

export class QueryDto {
  @ApiProperty()
  projectId: number;
}

export class DeleteDto {
  @ApiProperty()
  projectId: number;
}
