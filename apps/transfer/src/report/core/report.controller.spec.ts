import { Test, TestingModule } from '@nestjs/testing';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';

describe('TransferController', () => {
  let transferController: ReportController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ReportController],
      providers: [ReportService],
    }).compile();

    transferController = app.get<ReportController>(ReportController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(transferController.getHello()).toBe('Hello World!');
    });
  });
});
