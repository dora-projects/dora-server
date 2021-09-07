import { Injectable } from '@nestjs/common';

@Injectable()
export class ManagerService {
  getHello(): string {
    return 'Hello 222!';
  }
}
