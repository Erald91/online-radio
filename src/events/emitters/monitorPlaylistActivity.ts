import { emitter } from "..";

export type IMonitorPlaylistActivity = 'MonitorPlaylistActivity';
export const MonitorPlaylistActivity = 'MonitorPlaylistActivity';

export const monitorPlaylistActivity = () => {
  emitter.emit(MonitorPlaylistActivity);
};
