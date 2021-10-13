import { Module } from '@nestjs/common';
import { SourcemapController } from './sourcemap.controller';
import { SourcemapService } from './sourcemap.service';

@Module({
  controllers: [SourcemapController],
  providers: [SourcemapService],
})
export class SourcemapModule {}
