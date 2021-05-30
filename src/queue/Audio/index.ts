import * as Bull from 'bull';
import { Queue } from '../Queue/Queue';
import Processors from './processors';
import { Job as BaseJob } from '../Job/Job';
import { monitorPlaylistActivity } from '../../events/emitters/monitorPlaylistActivity';
import { IQueue } from '../Queue/IQueue';
import { extend } from '../../helpers/common';

export const QUEUE_NAME = 'audio-streaming';
export type IQueueJob = 'processAudio';
export type IQueueData = {
  audioFilePath: string;
}

type IAudioQueue = {
  queueSong: (data: IQueueData) => Promise<Bull.Job<IQueueData>>;
  flush: () => Promise<void>;
};

const AudioQueue = (queue: IQueue<IQueueData>): IAudioQueue => {
  const _queueSong = (
    data: IQueueData,
    options: Bull.JobOptions = {removeOnComplete: true, removeOnFail: true}
  ): Promise<Bull.Job<IQueueData>> => {
    return queue.addJob(BaseJob(data, 'processAudio', options));
  };

  queue.queue.on('drained', () => {
    console.log(`Audio queue drained from all song jobs...`);
    monitorPlaylistActivity(true);
  });

  queue.queue.on('cleaned', () => {
    console.log(`Audio queue cleaned from all waiting and active jobs...`);
  });

  return {
    queueSong: _queueSong,
    flush: queue.flush
  };
}

export default extend(Queue, AudioQueue)(QUEUE_NAME, Processors);
