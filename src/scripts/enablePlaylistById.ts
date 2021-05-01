require('dotenv').config();
import Queue from '../queue';
import Database from '../database/Database';
import StreamingService from '../services/StreamingService';

(async () => {
  const argv = process.argv.splice(2);
  const idArgIndex = argv.indexOf('--id');
  if (idArgIndex === -1) {
    throw new Error('Argument --id is missing from the command');
  }
  const idArgValue = argv[idArgIndex + 1];
  if (!idArgValue) {
    throw new Error('Argument --id value is missing from the command');
  }
  Queue.init();
  await Database.init();
  await StreamingService.streamPlaylistById(idArgValue);
  await Database.close();
  process.exit(0);
})();
