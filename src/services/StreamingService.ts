import Database from '../database/Database';
import Queue from '../queue';
import * as path from 'path';
import { IScheduleStatus } from '../database/models/Schedule';

export default (() => {
  const _streamPlaylistById = async (playlistId: string) => {
    const {getPlaylistById} = Database.repositories().playlistsRepository;
    const {getSongsByIds} = Database.repositories().songsRepository;
    const {updateScheduledPlaylistStatus} = Database.repositories().schedulesRepository;
    const playlist = await getPlaylistById(playlistId);
    if (!playlist) {
      return console.log(`Couldn't find playlist record to initiate songs streaming.`, playlistId);
    }
    const songs = await getSongsByIds(playlist.songs);
    if (!songs.length) {
      return console.log(`Couldn't find any songs records for the given playlist.`, playlistId);
    }
    const {addJob, queue} = Queue.getQueues().audioQueue;
    const queueInstance = queue();
    try {
      // Make sure that all pending jobs are rmoved from the queue
      await queueInstance.flush();
      // Create job for each song included in the playlist
      await (async function addSongsOnTheQueue(songs: Array<any>) {
        const song = songs.shift();
        if (!song) {
          return Promise.resolve(null);
        }
        const audioFilePath = song.remote ? song.source : path.join(__dirname, '..', 'storage', song.source);
        await addJob({audioFilePath});
        return addSongsOnTheQueue(songs);
      })(songs);
      // Update status of the playlist and mark as 'Active'
      await updateScheduledPlaylistStatus(playlistId, IScheduleStatus.Active);
      console.log(`Jobs created successfully for each song and playlist ${playlistId} is streaming now`);
    } catch (error) {
      console.log(`Something went wrong on playlist streaming ${playlistId}`, error.stack);
    }
  }

  return {
    streamPlaylistById: _streamPlaylistById
  };
})();
