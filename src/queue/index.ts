import AudioQueue from './Audio';

export default (() => {
  const _getQueues = () => {
    return {
      audioQueue: AudioQueue
    }
  };
  return {
    getQueues: _getQueues
  }
})();
