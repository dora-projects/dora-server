import { Test, TestingModule } from '@nestjs/testing';
import { MyConfigModule } from 'libs/datasource/config';
import { AnalysisService } from './analysis.service';
import { MyDatabase, MyElasticModule } from 'libs/datasource';
import { ProjectModule } from '../project/project.module';

describe('AnalysisService', () => {
  let service: AnalysisService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [MyConfigModule, MyDatabase, MyElasticModule, ProjectModule],
      providers: [AnalysisService],
    }).compile();

    service = moduleRef.get<AnalysisService>(AnalysisService);
  });

  it('should get appKey', async () => {
    const t1 =
      '{"size":0,"query":{"bool":{"filter":[{"match":{"appKey":"76d75c9c-859f-4df6-8ea8-58cd7c7b0e74"}},{"match":{"type":"error"}}]}},"aggregations":{"count":{"cardinality":{"field":"event_id.keyword"}}}}';

    const appKey = service.matchAppKeyInString(t1);
    expect(appKey).toEqual('76d75c9c-859f-4df6-8ea8-58cd7c7b0e74');
  });
});
