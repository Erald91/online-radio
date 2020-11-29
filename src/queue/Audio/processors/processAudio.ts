import * as Bull from 'bull';
import * as Throttle from 'throttle';
import * as fs from 'fs';
import { IProcessBagItem } from '../../Queue/IQueue';
import SocketService from '../../../socket';

export default {
  jobName: 'processAudio',
  processFunc: async (job: Bull.Job, done: Bull.DoneCallback) => {
    const playStream = await new Promise((resolve) => {
      console.log('Audio File Path', job.data.audioFilePath);
      const audioFileStream = fs.createReadStream(job.data.audioFilePath);
      audioFileStream
        .pipe(new Throttle(1536000 / 8))
        .on('data', chunk => {
          SocketService.getServer().sockets.emit('stream', {chunk});
        })
        .on('end', resolve);
      console.log('Processing audio stream', job.data);
    });
    done(null);
  }
} as IProcessBagItem;
