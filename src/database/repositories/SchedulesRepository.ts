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

  const _hasActiveScheduledPlaylist = async (): Promise<boolean> => {
    try {
      const active = await _model.findOne({status: IScheduleStatus.Active});
      return !!active;
    } catch (error) {
      console.log(`Couldn't find active playlist: `, error.stack);
      return false;
    }
  };

  const _getNextPendingScheduledPlaylist = async (): Promise<object> => {
    try {
      return await _model.findOne({status: IScheduleStatus.Pending}, {sort: {createdAt: 1}});
    } catch (error) {
      console.log(`Couldn't find next pending playlist: `, error.stack);
      return null;
    }
  };
  
  return {
    createSchedule: _createSchedule,
    hasActiveScheduledPlaylist: _hasActiveScheduledPlaylist,
    getNextPendingScheduledPlaylist: _getNextPendingScheduledPlaylist,
    model: _model
  };
};
