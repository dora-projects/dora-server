import { Injectable } from '@nestjs/common';

@Injectable()
export class AlertService {
  getHello(): string {
    return 'Hello alert!';
  }
}
