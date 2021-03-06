import { Test, TestingModule } from '@nestjs/testing';
import { MyConfigModule } from './index';
import { ConfigService } from '@nestjs/config';

describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [MyConfigModule],
    }).compile();

    service = moduleRef.get<ConfigService>(ConfigService);
  });

  it('should be equal', () => {
    expect(service.get('typeorm.connection')).toEqual('postgres');
  });
});
