import { Db, ObjectID } from 'mongodb';
import Playlist from '../models/Playlist';

export default async (db: Db) => {
  const _model = await Playlist(db);

  const _createPlaylist = async (title: string, description: string = '', songs: Array<string>) => {
    try {
      return await _model.insertOne({title, description, songs});
    } catch (error) {
      console.log(`Couldn't create playlist: `, error.stack);
      return null;
    }
  };

  const _getPlaylistById = async (playlistId: string) => {
    try {
      return await _model.findOne(new ObjectID(playlistId));
    } catch (error) {
      console.log(`Couldn't find playlist with ID: `, playlistId, error.stack);
      return null;
    }
  };

  return {
    createPlaylist: _createPlaylist,
    getPlaylistById: _getPlaylistById,
    model: _model
  }
};
