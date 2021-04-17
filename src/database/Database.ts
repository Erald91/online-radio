import {MongoClient, MongoClientOptions} from 'mongodb';
import appConfigs from '../configs/appConfig';
import SongsRepository from './repositories/SongsRepository';
import PlaylistsRepository from './repositories/PlaylistsRepository';

// Connection URL string to ensure proper connection with MongoDB server
const CONNECTION_URL = `mongodb://${appConfigs.mongodb.host}:${appConfigs.mongodb.port}/${appConfigs.mongodb.database}`;
// Default connection options
const DEFAULT_OPTIONS: MongoClientOptions = {
  useUnifiedTopology: true, // support on same implementation better handling and monitoring for all topologies
  useNewUrlParser: true, // enable new URL format support (include database as URL param needs this enable)
  poolSize: 10, // number of concurrent connections from the same instance
  connectTimeoutMS: 5000 // the timeout to wait until a connection is marked as failed
};

export default (() => {
  let songsRepository = null;
  let playlistsRepository = null;

  let client: MongoClient = new MongoClient(CONNECTION_URL, {...DEFAULT_OPTIONS});
  client.on('serverOpening', () => {
    console.log('MongoClient ready for potential server connection!!!');
  });
  client.on('serverClosed', () => {
    console.log('MongoClient disconnected from server instance!!!');
  });
  client.on('topologyOpening', () => {
    console.log('MongoClient attempting on topology connection!!!');
  });
  const _init = async () => {
    try {
      // Attempt connection to the server
      await client.connect();
      const db = client.db();
      // Verify connection with database
      await db.command({ ping: 1});
      console.log('MongoClient successfully connected with database!!!');
      // Initiate repositories
      songsRepository = SongsRepository(db);
      playlistsRepository = PlaylistsRepository(db);
    } catch (error) {
      console.log('MongoClient failed connecting with MongoDB', error.stack);
    }
  };
  const _seed = async () => {
    const results = await songsRepository.addSeedSongs();
    if (results) {
      const songs = Object.values(results.insertedIds);
      await playlistsRepository.createPlaylist('Seed Playlist', 'Lorem ipsum', songs);
    }
  };
  const _close = () => {
    return client.close();
  }
  return {
    init: _init,
    seed: _seed,
    close: _close
  }
})();
