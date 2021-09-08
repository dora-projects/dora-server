import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { MyConfigModule } from 'libs/shared/config';
import { ConfigService } from '@nestjs/config';

export const MyElasticModule = ElasticsearchModule.registerAsync({
  imports: [MyConfigModule],
  useFactory: async (configService: ConfigService) => ({
    node: configService.get('ELASTICSEARCH_NODE'),
    auth: {
      username: configService.get('ELASTIC_USERNAME'),
      password: configService.get('ELASTIC_PASSWORD'),
    },
  }),
  inject: [ConfigService],
});
