import { Test, TestingModule } from '@nestjs/testing';
import { NotifyService } from './notify.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertContact, AlertRule, MyDatabase, Project } from 'libs/datasource';

describe('NotifyService', () => {
  let service: NotifyService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        MyDatabase,
        TypeOrmModule.forFeature([Project, AlertRule, AlertContact]),
      ],
      providers: [NotifyService],
    }).compile();

    service = moduleRef.get<NotifyService>(NotifyService);
  });

  it('', async () => {
    const r = await service.getProjectRules('12');
    expect(r).toEqual('Hello alert!');
  });
});
