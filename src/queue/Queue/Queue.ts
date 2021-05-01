import * as Bull from 'bull';
import AppConfig from '../../configs/appConfig';
import { IQueue, IProcessBag } from './IQueue';
import { IJob } from '../Job/IJob';

export const Queue = <T>(
  name: string,
  processBag: IProcessBag = [],
  options: Bull.QueueOptions = {}
): IQueue<T> => {
  const Queue = new Bull(name, null, {
    redis: {
      port: AppConfig.redis.port,
      host: AppConfig.redis.host
    },
    ...options
  });
  for(const {jobName, processFunc} of processBag) {
    Queue.process(jobName, processFunc);
  }
  Queue.on('error', (error) => {
    console.log(`[Queue][${name}]:Error`, error);
  });
  Queue.on('waiting', (job: Bull.Job) => {
    console.log(`[Queue][${name}]:JobWaiting`, job.id);
  });
  Queue.on('active', (job: Bull.Job, promise: Bull.JobPromise) => {
    console.log(`[Queue][${name}]:JobStarted`, job.id);
  });
  Queue.on('completed', (job: Bull.Job, result) => {
    console.log(`[Queue][${name}]:JobCompleted`, job.id, result);
  });
  Queue.on('failed', (job: Bull.Job, error) => {
    console.log(`[Queue][${name}]:JobFailed`, job.id, error);
  });
  Queue.on('drained', () => {
    console.log(`[Queue][${name}]:QueueDrained`);
  });
  const _addJob = (job: IJob<T>) => {
    const { name, data, options } = job;
    return Queue.add(name || null, data, options);
  };
  const _flush = async () => {
    await Queue.clean(0, 'wait');
    await Queue.clean(0, 'delayed');
    await Queue.clean(0, 'active');
    await Queue.clean(0, 'completed');
    await Queue.clean(0, 'failed');
    await Queue.empty();
  };
  return {
    queue: Queue,
    addJob: _addJob,
    flush: _flush
  };
};
