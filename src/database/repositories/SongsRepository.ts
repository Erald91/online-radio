import { Db } from 'mongodb';
import Song from '../models/Song';

export default (db: Db) => {
  const _model = Song(db);

  const _addSeedSongs = async () => {
    const seeds = [
      {
        title: 'Keep loving',
        artist: 'West Side Sound',
        source: 'track_1.wav'
      },
      {
        title: 'Zombie',
        artist: 'The Cranberries',
        source: 'track_2.wav'
      },
      {
        title: 'Identity Crisis',
        artist: 'Saga',
        source: 'track_3.wav'
      },
      {
        title: 'Lupin III',
        artist: 'Mediaset Italia',
        source: 'track_4.wav'
      },
      {
        title: 'Dan Dan Kokoro',
        artist: 'Studio aLf',
        source: 'track_5.wav'
      }
    ];
    try {
      const results = await _model.insertMany(seeds);
      console.log(`Seed songs added successfully`);
      return results;
    } catch (error) {
      console.log(`Couldn't add seeds songs`, error.stack);
      return null;
    }
  }

  return {
    addSeedSongs: _addSeedSongs,
    model: _model
  }
};
