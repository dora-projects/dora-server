import { Test, TestingModule } from '@nestjs/testing';
import { AlertService } from './alert.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertContact, AlertRule, MyDatabase, Project } from 'libs/datasource';

describe('AlertService', () => {
  let service: AlertService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        MyDatabase,
        TypeOrmModule.forFeature([Project, AlertRule, AlertContact]),
      ],
      providers: [AlertService],
    }).compile();

    service = moduleRef.get<AlertService>(AlertService);
  });

  it('', async () => {
    const r = await service.getProjectRules('12');
    expect(r).toEqual('Hello alert!');
  });
});
