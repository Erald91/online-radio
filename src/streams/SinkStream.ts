import * as uuid from 'uuid';
import { Writable } from 'stream';

import { SinkDrop } from '../events/emitters/streams/sinkDrop';

export type ISinkStream = {
  id: string;
  stream: Writable;
};

const SinkStream = (stream: Writable): ISinkStream => {
  const id = uuid.v4();
  stream.on('close', () => {
    SinkDrop(id);
  });
  stream.on('error', () => {
    SinkDrop(id);
  });
  return {
    id,
    stream
  };
};

export default SinkStream;
