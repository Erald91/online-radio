import * as Bull from 'bull';
import * as Throttle from 'throttle';
import * as fs from 'fs';
import { IProcessBagItem } from '../../Queue/IQueue';
import SocketService from '../../../socket';
import { Socket } from 'socket.io';

export default {
  jobName: 'processAudio',
  processFunc: async (job: Bull.Job, done: Bull.DoneCallback) => {
    const playStream = await new Promise((resolve) => {
      console.log('Audio File Path', job.data.audioFilePath);
      const audioFileStream = fs.createReadStream(job.data.audioFilePath);
      const stat = fs.statSync(job.data.audioFilePath);
      audioFileStream
        .pipe(new Throttle(1536000 / 8))
        .on('data', chunk => {
          SocketService.getConnectedSockets().forEach(
            (socket: Socket) => socket.emit('stream', {chunk, stat})
          );
        })
        .on('end', resolve);
      console.log('Processing audio stream', job.data);
    });
    done(null);
  }
} as IProcessBagItem;
