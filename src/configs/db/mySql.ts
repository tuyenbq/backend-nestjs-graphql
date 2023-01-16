import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';
const pathEnv =
  process.env.NODE_ENV === 'e2e'
    ? path.join(__dirname, '../..', `/../.env.e2e`)
    : null;
// eslint-disable-next-line
require('dotenv').config({ debug: process.env.APP_DEBUG, path: pathEnv });
const dbConfig: TypeOrmModuleOptions = {
  type: process.env.RDS_TYPE === 'mysql' ? 'mysql' : 'mssql',
  port: Number(process.env.RDS_PORT) || 1433,
  host: process.env.RDS_HOST,
  username: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DATABASE,
  entities: [path.join(__dirname, '../..', '/**/*.entity{.ts,.js}')],
  logging: process.env.NODE_ENV === 'e2e' ? ['info', 'log'] : 'all',
  connectionTimeout: Number(process.env.RDS_TIMEOUT) || 2147483647,
  requestTimeout: Number(process.env.RDS_TIMEOUT) || 2147483647,
  options: {
    cancelTimeout: Number(process.env.RDS_TIMEOUT) || 2147483647,
  },
  synchronize: false, // Don't use it on production, It will sync entity and modify your database to match with entity
};
export default dbConfig;
