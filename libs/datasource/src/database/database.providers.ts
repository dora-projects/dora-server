import { createConnection } from 'typeorm';
import { DatabaseConnection } from 'libs/shared/constant';

export const databaseProviders = [
  {
    provide: DatabaseConnection,
    useFactory: async () =>
      await createConnection({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'root',
        database: 'test',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
  },
];
