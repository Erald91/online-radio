import Streams from '../../../streams/Streams';

export const dropSinkStream = ({sinkId}) => {
  Streams.dropSink(sinkId);
};
