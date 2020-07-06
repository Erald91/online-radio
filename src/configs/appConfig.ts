import { IAppConfigs } from '../../@types/appConfigs';

export default {
  port: process.env.PORT || 4000,
  buildVersion: process.env.npm_package_version,
  redis: {
    port: process.env.REDIS_PORT || 6379,
    host: process.env.REDIS_HOST || '127.0.0.1'
  }
} as IAppConfigs;
