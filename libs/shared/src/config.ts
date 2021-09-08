import { ConfigModule } from '@nestjs/config';

export const MyConfigModule = ConfigModule.forRoot({
  isGlobal: true,
});
