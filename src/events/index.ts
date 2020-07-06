import * as EventEmitter from 'events';
import listenersList from './listeners';
import { IContext } from './listeners/IListener';

export const emitter = new EventEmitter.EventEmitter();

export default (() => {
  const _registerListeners = () => {
    for(const {event, listeners} of listenersList) {
      emitter.on(event, (context: IContext) => {
        console.log(`[Event][${event}]`, context);
        for(const listener of listeners) {
          listener(context);
        }
      });
    }
  }

  return {
    registerListeners: _registerListeners
  }
})();