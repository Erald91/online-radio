import * as Bull from 'bull';
import * as Throttle from 'throttle';
import * as fs from 'fs';
import { IProcessBagItem } from '../../Queue/IQueue';
import Streams from '../../../streams/Streams';

export default {
  jobName: 'processAudio',
  processFunc: async (job: Bull.Job, done: Bull.DoneCallback) => {
    await new Promise((resolve) => {
      console.log('Audio File Path', job.data.audioFilePath);
      fs.createReadStream(job.data.audioFilePath)
        .pipe(new Throttle(1536000 / 8))
        .on('data', chunk => Streams.getMainAudioStream().push(chunk))
        .on('end', resolve);
      console.log('Processing audio stream', job.data);
    });
    done(null);
  }
} as IProcessBagItem;
