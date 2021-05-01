import { emitter } from "..";

export type IMonitorPlaylistActivity = 'MonitorPlaylistActivity';
export const MonitorPlaylistActivity = 'MonitorPlaylistActivity';

export const monitorPlaylistActivity = (treatActiveAsFinished: boolean = false) => {
  emitter.emit(MonitorPlaylistActivity, treatActiveAsFinished);
};
