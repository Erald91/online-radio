import { Db } from 'mongodb';
import Playlist from '../models/Playlist';

export default (db: Db) => {
  const _model = Playlist(db);

  const _createPlaylist = async (title: string, description: string = '', songs: Array<string>) => {
    try {
      return await _model.insertOne({title, description, songs});
    } catch (error) {
      console.log(`Coulddn't create playlist: `, error.stack);
      return null;
    }
  };

  return {
    createPlaylist: _createPlaylist,
    model: _model
  }
};
