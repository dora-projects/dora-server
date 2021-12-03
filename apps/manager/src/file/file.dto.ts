import { ApiProperty } from '@nestjs/swagger';

export class UploadDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  type: string;
}
