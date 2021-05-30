import * as Bull from 'bull';
import { IQueueJob as IAudioJob } from '../Audio';
import { IJob } from '../Job/IJob';

export type IQueue<T> = {
  queue: Bull.Queue;
  addJob: (job: IJob<T>) => Promise<Bull.Job>;
  flush: () => Promise<void>;
};

export type IJobName = IAudioJob;

export type IProcessBagItem = {
  jobName: IJobName;
  processFunc: Bull.ProcessCallbackFunction<any>;
};
export type IProcessBag = Array<IProcessBagItem>;
