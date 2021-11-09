import { Controller, Get } from '@nestjs/common';
import { SourcemapService } from './sourcemap.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('sourcemap')
@Controller()
export class SourcemapController {
  constructor(private readonly sourcemapService: SourcemapService) {}

  @Get('manager/sourcemaps')
  getHello(): string {
    return this.sourcemapService.getHello();
  }
}
