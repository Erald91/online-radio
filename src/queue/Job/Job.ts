import * as Bull from 'bull';
import { IJob } from './IJob';
import { IJobName } from '../Queue/IQueue';

export const Job = <T>(data: T, name?: IJobName, options?: Bull.JobOptions): IJob<T> => ({
  name,
  data,
  options
});