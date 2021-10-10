import { Test, TestingModule } from '@nestjs/testing';
import { MyConfigModule } from 'libs/shared/config';
import { SearchService } from './elasticsearch.service';
import { MyElasticModule } from './index';

describe('SearchService', () => {
  let service: SearchService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [MyConfigModule, MyElasticModule],
      providers: [SearchService],
    }).compile();

    service = moduleRef.get<SearchService>(SearchService);
  });

  it('should ping be toBeTruthy', async () => {
    const r = await service.ping();
    expect(r).toBeTruthy();
  });

  it('should checkIndexIsExist be work', async () => {
    const r = await service.checkIndexIsExist();
    expect(r).toBeTruthy();
  });
});
