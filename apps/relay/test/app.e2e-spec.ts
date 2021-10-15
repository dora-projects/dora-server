import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('relay app (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  function hasKeys(res) {
    if (!('app' in res.body)) throw new Error('missing app key');
    if (!('uptime' in res.body)) throw new Error('missing uptime key');
    if (!('formNow' in res.body)) throw new Error('missing formNow key');
  }

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect(hasKeys);
  });
});
