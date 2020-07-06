import * as Bull from 'bull';
import { IJobName } from '../Queue/IQueue'; 

export type IJob<T> = {
  data: T;
  name?: IJobName;
  options?: Bull.JobOptions
};
