import {
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SourcemapService } from './sourcemap.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { DeleteDto, QueryDto } from './sourcemap.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('sourcemap')
@Controller()
export class SourcemapController {
  constructor(private readonly sourcemapService: SourcemapService) {}

  @Get('manager/sourcemaps')
  querySourcemaps(@Query() query: QueryDto): any {
    return query;
  }

  @Delete('manager/sourcemap')
  deleteSourcemap(@Query() query: DeleteDto): any {
    return query;
  }

  @Post('manager/sourcemap/parser')
  parser(): void {
    return;
  }
}
