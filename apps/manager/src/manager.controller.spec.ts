import { Test, TestingModule } from '@nestjs/testing';
import { ManagerController } from './manager.controller';
import { ManagerService } from './manager.service';

describe('ManagerController', () => {
  let managerController: ManagerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ManagerController],
      providers: [ManagerService],
    }).compile();

    managerController = app.get<ManagerController>(ManagerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(managerController.getHello()).toBe('Hello World!');
    });
  });
});
