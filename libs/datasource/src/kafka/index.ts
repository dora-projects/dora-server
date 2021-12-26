import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { MyConfigModule } from 'libs/datasource/config';

export const KAFKA_SERVICE = 'KAFKA_SERVICE';

export const KafkaModule = ClientsModule.registerAsync([
  {
    name: KAFKA_SERVICE,
    imports: [MyConfigModule],
    useFactory: async (configService: ConfigService) => {
      return {
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: configService.get('kafka.brokers'),
          },
        },
      };
    },
    inject: [ConfigService],
  },
]);
