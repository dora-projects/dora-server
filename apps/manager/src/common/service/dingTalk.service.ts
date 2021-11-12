import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DingTalkService {
  constructor(private configService: ConfigService) {}

  async sendMessage(): Promise<any> {
    return;
  }
}
