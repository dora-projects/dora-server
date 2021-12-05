import { Module } from '@nestjs/common';
import { SourcemapController } from './sourcemap.controller';
import { SourcemapService } from './sourcemap.service';
import { PrismaService } from 'libs/datasource';

@Module({
  controllers: [SourcemapController],
  providers: [SourcemapService, PrismaService],
})
export class SourcemapModule {}
