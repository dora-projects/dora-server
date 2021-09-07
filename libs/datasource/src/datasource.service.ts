import { Injectable } from '@nestjs/common';

@Injectable()
export class DatasourceService {
  getHello(): string {
    return 'form datasource';
  }
}
