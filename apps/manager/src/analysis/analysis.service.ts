import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalysisService {
  getHello(): string {
    return 'Hello !';
  }
}
