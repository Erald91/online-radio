import BaseModel, { IDocumentSchema, IDocumentType } from './helpers/BaseModel';

export enum IScheduleStatus {
  Finished = 'finished',
  Active = 'active',
  Pending = 'pending'
}

const SCHEMA: IDocumentSchema = {
  playlistId: {
    type: IDocumentType.String,
    required: true
  },
  status: {
    type: IDocumentType.String, // finished, active, pending
    required: true
  },
  repeat: {
    type: IDocumentType.Boolean
  },
  createdAt: {
    type: IDocumentType.Date,
    required: true
  }
};

const indexes = [{status: 1}];

const Schedule = BaseModel('schedules', SCHEMA, {indexes});

export default Schedule;
