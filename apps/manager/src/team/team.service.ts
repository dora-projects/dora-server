import { Injectable } from '@nestjs/common';

@Injectable()
export class TeamService {
  getHello(): string {
    return 'Hello !';
  }
}
