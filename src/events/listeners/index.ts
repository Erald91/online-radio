import { IEventListenerMap } from './IListener';
import checkPlaybackRestart from './monitorPlaylistActivity/checkPlaybackRestart';

export default [
  {
    event: 'MonitorPlaylistActivity',
    listeners: [checkPlaybackRestart]
  }
] as Array<IEventListenerMap>;
