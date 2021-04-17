import { Db } from 'mongodb';
import Song from '../models/Song';

export default (db: Db) => {
  const model = Song(db);

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
      await model.insertMany(seeds);
      console.log(`Seed songs added successfully`);
    } catch (error) {
      console.log(`Couldn't add seeds songs`, error.stack);
    }
  }

  return {
    addSeedSongs: _addSeedSongs 
  }
};
