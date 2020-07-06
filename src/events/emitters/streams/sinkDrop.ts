import { emitter } from '../../';

export type SinkDropEvent = 'Sink:Drop';
export const SinkDropEvent: SinkDropEvent = 'Sink:Drop';

export const SinkDrop = (sinkId: string) => {
  emitter.emit(SinkDropEvent, {sinkId});
};
