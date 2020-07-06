import SinkStream, { ISinkStream } from './SinkStream';
import { Writable } from 'stream';

export default (() => {
  let sinkStreams: Array<ISinkStream> = [];
  const _dropSink = (sinkId: string) => {
    sinkStreams = sinkStreams.filter((sink: ISinkStream) => sink.id !== sinkId);
  };
  const _addSink = (stream: Writable) => {
    sinkStreams.push(SinkStream(stream));
  };
  return {
    sinkStreams,
    dropSink: _dropSink,
    addSink: _addSink
  }
})();