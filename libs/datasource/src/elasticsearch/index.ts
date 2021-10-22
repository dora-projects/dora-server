import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { MyConfigModule } from 'libs/datasource/config';
import { ConfigService } from '@nestjs/config';

export const MyElasticModule = ElasticsearchModule.registerAsync({
  imports: [MyConfigModule],
  useFactory: async (configService: ConfigService) => ({
    node: configService.get('elasticsearch.node'),
    auth: {
      username: configService.get('elasticsearch.username'),
      password: configService.get('elasticsearch.password'),
    },
  }),
  inject: [ConfigService],
});
