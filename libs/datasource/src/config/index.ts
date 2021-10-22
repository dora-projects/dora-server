import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';

export const MyConfigModule = ConfigModule.forRoot({
  load: [configuration],
  ignoreEnvFile: true,
  isGlobal: true,
  cache: true,
});
