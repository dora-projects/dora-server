import { Injectable } from '@nestjs/common';

@Injectable()
export class SourcemapService {
  getHello(): string {
    return 'Hello !';
  }
}
