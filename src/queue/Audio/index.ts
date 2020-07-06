import * as Bull from 'bull';
import { Queue } from '../Queue/Queue';
import Processors from './processors';
import { IJob } from '../Job/IJob';
import { Job as BaseJob } from '../Job/Job';

export const QUEUE_NAME = 'audio-streaming';
export type IQueueJob = 'processAudio';
export type IQueueData = {
  audioFilePath: string;
}

export const ProcessAudioJob = (data: IQueueData, options?: Bull.JobOptions): IJob<IQueueData> => {
  return BaseJob.call(null, data, 'processAudio', options);
};

export default () => Queue<IQueueData>(QUEUE_NAME, Processors);