import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import {
  AlertBullQueueModule,
  EventBullQueueModule,
  IssueQueueModule,
  MyElasticModule,
} from 'libs/datasource';
import { EventProcessor } from './event.processor';

describe('EventService', () => {
  let service: EventService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        EventBullQueueModule,
        AlertBullQueueModule,
        IssueQueueModule,
        MyElasticModule,
      ],
      providers: [EventProcessor, EventService],
    }).compile();

    service = moduleRef.get<EventService>(EventService);
  });

  it('aggregationError', async () => {
    const data = {
      exception: {
        values: [
          {
            value: 'ResizeObserver loop limit exceeded',
            type: 'Error',
            mechanism: {
              synthetic: true,
              handled: false,
              type: 'onerror',
            },
            stacktrace: {
              frames: [
                {
                  colno: 0,
                  filename: 'http://114.55.166.248:8888/data/analysis',
                  function: '?',
                  in_app: true,
                  lineno: 0,
                },
              ],
            },
          },
        ],
      },
    };
    const r = await service.aggregationError(data);
    expect(r.fingerprint).toEqual(
      '496f144edf91a437b513fe6d20df2e0acf9b43d0850d0bd02ffbf0fc7fb231d8',
    );
  });
});
