import { Test, TestingModule } from '@nestjs/testing';
import { MyConfigModule } from 'libs/datasource/config';
import { MailService } from './mail.service';

describe('MailService test', () => {
  let service: MailService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [MyConfigModule],
      providers: [MailService],
    }).compile();

    service = moduleRef.get<MailService>(MailService);
  });

  it('should mail send success', async () => {
    await service.sendEmail({
      from: '',
      to: 'nancode@qq.com',
      subject: '测试',
      text: '测试测试',
    });
  });
});
