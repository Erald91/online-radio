import { Db } from 'mongodb';
import Schedule, { IScheduleStatus } from '../models/Schedule';

export default async (db: Db) => {
  const _model = await Schedule(db);

  const _createSchedule = async (playlistId: string, repeat: boolean = false) => {
    try {
      return await _model.insertOne({playlistId, status: IScheduleStatus.Pending, repeat, createdAt: new Date()});
    } catch (error) {
      console.log(`Couldn't create schedule: `, error.stack);
      return null;
    }
  };

  const _getActiveScheduledPlaylist = async (): Promise<object> => {
    try {
      return await _model.findOne({status: IScheduleStatus.Active});
    } catch (error) {
      console.log(`Couldn't find active playlist: `, error.stack);
      return null;
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

  const _updateScheduledPlaylistStatus = async (playlistId: string, status: IScheduleStatus) => {
    try {
      return await _model.updateOne({playlistId}, {$set: {status}});
    } catch (error) {
      console.log(`Couldn't update playlist ${playlistId} with new status ${status}: `, error.stack);
      return null;
    }
  };
  
  return {
    createSchedule: _createSchedule,
    getActiveScheduledPlaylist: _getActiveScheduledPlaylist,
    getNextPendingScheduledPlaylist: _getNextPendingScheduledPlaylist,
    updateScheduledPlaylistStatus: _updateScheduledPlaylistStatus,
    model: _model
  };
};
