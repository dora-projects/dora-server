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
      '{"size":0,"query":{"bool":{"filter":[{"match":{"appKey":"d6eca399952c4c0ca067f28987aeed48"}},{"match":{"type":"api"}},{"match":{"subType":"xhr"}},{"range":{"ts":{"gte":123123123,"lte":12312312312}}}]}}}';

    const appKey = service.matchAppKeyInString(t1);
    expect(appKey).toEqual('d6eca399952c4c0ca067f28987aeed48');
  });

  it('test countEventType', async () => {
    const result = await service.eventTypeCount({ type: 'error' });
    expect(typeof result).toEqual('number');
  });

  it('test eventTypeTrend', async () => {
    const result = await service.eventTypeTrend({
      type: 'error',
      interval: '10m',
    });
    console.log(result);
    // expect(typeof result).toEqual('number');
  });

  it('test getWebVitalsTotal', async () => {
    const result = await service.getWebVitalsTotal({
      type: 'pref',
    });
    console.log(JSON.stringify(result, null, 2));
  });

  it('test getWebVitalsPercentiles', async () => {
    const result = await service.getWebVitalsPercentiles({
      type: 'pref',
    });
    console.log(JSON.stringify(result, null, 2));
  });

  it('test getWebVitalsRange', async () => {
    const result = await service.getWebVitalsRange({
      type: 'pref',
    });
    console.log(JSON.stringify(result, null, 2));
  });
});
