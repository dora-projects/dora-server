import * as path from 'path';
import * as dotenv from 'dotenv';

const envFile =
  process.env.NODE_ENV === 'production'
    ? '.env.production'
    : '.env.development';

dotenv.config({
  path: path.resolve(process.cwd(), envFile),
});

export default () => {
  return {
    dora_url: process.env.DORA_URL,
    relay_port: parseInt(process.env.RELAY_PORT, 10),
    manager_port: parseInt(process.env.MANAGER_PORT, 10),
    jwt_secret: process.env.JWT_SECRET,
    typeorm: {
      connection: process.env.TYPEORM_CONNECTION,
      host: process.env.TYPEORM_HOST,
      port: parseInt(process.env.TYPEORM_PORT, 10),
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      db: process.env.TYPEORM_DATABASE,
    },
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
    },
    elasticsearch: {
      node: process.env.ELASTICSEARCH_NODE,
      username: process.env.ELASTIC_USERNAME,
      password: process.env.ELASTIC_PASSWORD,
    },
    email: {
      host: process.env.EMAIL_SERVER_HOST,
      port: parseInt(process.env.EMAIL_SERVER_PORT, 10),
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  };
};
