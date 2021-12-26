import { Injectable } from '@nestjs/common';

@Injectable()
export class SystemService {
  // 获取队列统计数值
  async getJobCounts(): Promise<any> {
    return {};
  }
}
