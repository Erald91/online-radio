export type IAppConfigs = {
  port: number;
  buildVersion: string;
  redis: {
    port: number;
    host: string;
  },
  mongodb: {
    database: string;
    host: string;
    port: string;
  }
};
