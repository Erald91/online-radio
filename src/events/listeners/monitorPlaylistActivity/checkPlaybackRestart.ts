import Database from '../../../database/Database';

export default async () => {
  const {
    hasActiveScheduledPlaylist,
    getNextPendingScheduledPlaylist
  } = Database.repositories().schedulesRepository;
  // In case any playlist is playing we cannot change the content of loaded songs in the queue
  if (await hasActiveScheduledPlaylist()) {
    return console.log(`One playlist is still active and playing content.`);
  }
  // Check for the next scheduled playlist that should resume streaming songs
  const nextPendingScheduledPlaylist = await getNextPendingScheduledPlaylist();
  if (!nextPendingScheduledPlaylist) {
    return console.log(`There is any other scheduled playlist to start with streaming.`);
  }
};
