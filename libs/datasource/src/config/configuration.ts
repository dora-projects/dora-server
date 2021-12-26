import * as path from 'path';
import * as dotenv from 'dotenv';

const envFile = '.env';

dotenv.config({
  path: path.resolve(process.cwd(), envFile),
});

interface Conf {
  [key: string]: any;
}

export default (): Conf => {
  return {
    dora_url: process.env.DORA_URL,
    relay_port: parseInt(process.env.RELAY_PORT, 10),
    process_port: parseInt(process.env.PROCESS_PORT, 10),
    manager_port: parseInt(process.env.MANAGER_PORT, 10),
    jwt_secret: process.env.JWT_SECRET,
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
    },
    kafka: {
      brokers: process.env.KAFKA_BROKERS.split(','),
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
