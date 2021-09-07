import { Injectable } from '@nestjs/common';

@Injectable()
export class TransferService {
  getHello(): string {
    return 'Hello World!';
  }
}
