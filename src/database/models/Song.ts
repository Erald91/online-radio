import BaseModel, { IDocumentSchema, IDocumentType } from './helpers/BaseModel';

const SCHEMA: IDocumentSchema = {
  title: {
    type: IDocumentType.String,
    required: true
  },
  artist: {
    type: IDocumentType.String,
    required: true
  },
  thumbnail: {
    type: IDocumentType.String
  },
  source: {
    type: IDocumentType.String,
    required: true
  },
  remote: {
    type: IDocumentType.Boolean
  }
};

const Song = BaseModel('songs', SCHEMA);

export default Song;
