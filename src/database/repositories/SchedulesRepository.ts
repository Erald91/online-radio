import { Db } from 'mongodb';
import Schedule, { IScheduleStatus } from '../models/Schedule';

export default (db: Db) => {
  const _model = Schedule(db);

  const _createSchedule = async (playlistId: string, repeat: boolean = false) => {
    try {
      return await _model.insertOne({playlistId, status: IScheduleStatus.Pending, repeat, createdAt: new Date()});
    } catch (error) {
      console.log(`Couldn't create schedule: `, error.stack);
      return null;
    }
  };
  
  return {
    createSchedule: _createSchedule,
    model: _model
  };
};
