import { Test, TestingModule } from '@nestjs/testing';
import { MyConfigModule } from 'libs/datasource/config';
import { DingTalkService } from './dingTalk.service';

describe('', () => {
  let service: DingTalkService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [MyConfigModule],
      providers: [DingTalkService],
    }).compile();

    service = moduleRef.get<DingTalkService>(DingTalkService);
  });

  it('should dingTalk send message success', async () => {
    await service.sendMessage();
  });
});
