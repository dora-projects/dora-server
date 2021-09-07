import { Test, TestingModule } from '@nestjs/testing';
import { AlertController } from './alert.controller';
import { AlertService } from './alert.service';

describe('AlertController', () => {
  let alertController: AlertController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AlertController],
      providers: [AlertService],
    }).compile();

    alertController = app.get<AlertController>(AlertController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(alertController.getHello()).toBe('Hello World!');
    });
  });
});
