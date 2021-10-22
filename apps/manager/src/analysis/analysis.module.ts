import { Module } from '@nestjs/common';
import { AnalysisController } from './analysis.controller';
import { AnalysisService } from './analysis.service';
import { MyDatabase, MyElasticModule } from 'libs/datasource';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [MyDatabase, MyElasticModule, ProjectModule],
  controllers: [AnalysisController],
  providers: [AnalysisService],
})
export class AnalysisModule {}
