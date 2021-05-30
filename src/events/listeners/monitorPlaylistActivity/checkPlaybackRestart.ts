import Database from '../../../database/Database';
import StreamingService from '../../../services/StreamingService';
import { IScheduleStatus } from '../../../database/models/Schedule';

export default async (treatActiveAsFinished: boolean = false) => {
  const {
    getActiveScheduledPlaylist,
    getNextPendingScheduledPlaylist,
    updateScheduledPlaylistStatus
  } = Database.repositories().schedulesRepository;
  // Retrieve schedule data for current active playlist that it's streaming
  const activeScheduledPlaylist = await getActiveScheduledPlaylist();
  // In case flag 'treatActiveAsFinished' is provided we need to properly update
  // current active record as finished, or repeat same playlist if repeat flag
  // is defined as well
  if (treatActiveAsFinished && activeScheduledPlaylist && activeScheduledPlaylist.repeat) {
    console.log(`Finished streaming playlist ${activeScheduledPlaylist.playlistId} is on repeat and being enabling again...`);
    return await StreamingService.streamPlaylistById(activeScheduledPlaylist.playlistId);
  }
  if (treatActiveAsFinished && activeScheduledPlaylist && !activeScheduledPlaylist.repeat) {
    console.log(`Finished streaming playlist ${activeScheduledPlaylist._id} marking as finished...`);
    await updateScheduledPlaylistStatus(activeScheduledPlaylist._id, IScheduleStatus.Finished);
  }
  
  if (!treatActiveAsFinished && activeScheduledPlaylist) {
    // In case any playlist is playing we cannot change the content of loaded songs in the queue
    return console.log(`One playlist is still active and playing content.`);
  }
  
  // Check for the next scheduled playlist that should resume streaming songs
  const nextPendingScheduledPlaylist = await getNextPendingScheduledPlaylist();
  if (!nextPendingScheduledPlaylist) {
    return console.log(`There is any other scheduled playlist to start with streaming.`);
  }
  await StreamingService.streamPlaylistById(nextPendingScheduledPlaylist._id);
};
