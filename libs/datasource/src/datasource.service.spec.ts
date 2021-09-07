import { Test, TestingModule } from '@nestjs/testing';
import { DatasourceService } from './datasource.service';

describe('DatasourceService', () => {
  let service: DatasourceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatasourceService],
    }).compile();

    service = module.get<DatasourceService>(DatasourceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
