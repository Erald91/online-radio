import * as Bull from 'bull';
import { IProcessBagItem } from '../../Queue/IQueue';

export default {
  jobName: 'processAudio',
  processFunc: (job: Bull.Job, done: Bull.DoneCallback) => {
    console.log('Processing audio stream', job.data);
    done(null);
  }
} as IProcessBagItem;
