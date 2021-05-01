import * as Bull from 'bull';
import { Queue } from '../Queue/Queue';
import Processors from './processors';
import { IJob } from '../Job/IJob';
import { Job as BaseJob } from '../Job/Job';
import { monitorPlaylistActivity } from '../../events/emitters/monitorPlaylistActivity';

export const QUEUE_NAME = 'audio-streaming';
export type IQueueJob = 'processAudio';
export type IQueueData = {
  audioFilePath: string;
}

const ProcessAudioJob = (data: IQueueData, options?: Bull.JobOptions): IJob<IQueueData> => {
  return BaseJob(data, 'processAudio', options);
};

export default () => {
  const queue = Queue<IQueueData>(QUEUE_NAME, Processors);

  const _addJob = (data: IQueueData, options?: Bull.JobOptions): Promise<Bull.Job<IQueueData>> => {
    return queue.addJob(ProcessAudioJob(data, options));
  };

  queue.queue.on('drained', () => {
    console.log(`Audio queue drained from all song jobs...`);
    monitorPlaylistActivity(true);
  });

  return {
    addJob: _addJob,
    queue: () => queue
  }
};
