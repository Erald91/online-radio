import BaseModel, { IDocumentSchema, IDocumentType } from './helpers/BaseModel';

const SCHEMA: IDocumentSchema = {
  title: {
    type: IDocumentType.String,
    required: true
  },
  description: {
    type: IDocumentType.String,
  },
  songs: {
    type: IDocumentType.Array,
    required: true
  }
};

const Playlist = BaseModel('playlists', SCHEMA);

export default Playlist;
