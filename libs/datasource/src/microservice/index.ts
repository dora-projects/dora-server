import { ClientsModule, Transport } from '@nestjs/microservices';
import { MyConfigModule } from 'libs/datasource/config';
import { ConfigService } from '@nestjs/config';

export const KAFKA_SERVICE = 'kafka_service';

export const MicroserviceModule = ClientsModule.registerAsync([
  {
    name: KAFKA_SERVICE,
    imports: [MyConfigModule],
    useFactory: async (configService: ConfigService) => {
      return {
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'dora',
            brokers: configService.get('kafka.brokers'),
          },
          consumer: {
            groupId: 'dora-server',
          },
        },
      };
    },
    inject: [ConfigService],
  },
]);
