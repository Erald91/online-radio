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

export default () => {
  const queue = Queue<IQueueData>(QUEUE_NAME, Processors);

  const _startTestPlaylist = () => {
    queue.addJob(ProcessAudioJob({audioFilePath: `${__dirname}/../../storage/track_1.mp3`}));
    queue.addJob(ProcessAudioJob({audioFilePath: `${__dirname}/../../storage/track_2.mp3`}));
    queue.addJob(ProcessAudioJob({audioFilePath: `${__dirname}/../../storage/track_3.mp3`}));
  }

  return {
    queue,
    startTestPlaylist: _startTestPlaylist
  }
};