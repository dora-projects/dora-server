import { Injectable } from '@nestjs/common';

@Injectable()
export class IssuesService {
  getHello(): string {
    return 'Hello!';
  }
}
