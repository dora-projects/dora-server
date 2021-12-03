import { Test, TestingModule } from '@nestjs/testing';
import { NotifyService } from './notify.service';
import { AlertBullQueueModule, MyElasticModule } from 'libs/datasource';
import { NotifyProcessor } from './notify.processor';
import { MailService } from 'apps/manager/src/common/service/mail.service';
import { AlertService } from 'apps/manager/src/alert/alert.service';
import { ProjectService } from 'apps/manager/src/project/project.service';

describe('NotifyService', () => {
  let service: NotifyService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AlertBullQueueModule, MyElasticModule],
      providers: [
        NotifyService,
        NotifyProcessor,
        MailService,
        AlertService,
        ProjectService,
      ],
    }).compile();

    service = moduleRef.get<NotifyService>(NotifyService);
  });

  it('', async () => {
    // const r = await service.getProjectRules('12');
    // expect(r).toEqual('Hello alert!');
  });
});
