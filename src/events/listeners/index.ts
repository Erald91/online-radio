import { IEventListenerMap } from './IListener';
import { dropSinkStream } from './streams/dropSinkStream';

export default [
  {
    event: 'Sink:Drop',
    listeners: [
      dropSinkStream
    ]
  }
] as Array<IEventListenerMap>;