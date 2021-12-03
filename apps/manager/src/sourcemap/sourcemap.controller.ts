import { Controller, Post, UseGuards } from '@nestjs/common';
import { SourcemapService } from './sourcemap.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('sourcemap')
@Controller()
export class SourcemapController {
  constructor(private readonly sourcemapService: SourcemapService) {}

  @Post('manager/sourcemap/parser')
  getHello(): string {
    return this.sourcemapService.getHello();
  }
}
