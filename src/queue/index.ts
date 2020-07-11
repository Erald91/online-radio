import AudioQueue from './Audio';

export default (() => {
  let audioQueue = null;
  const _init = () => {
    audioQueue = AudioQueue();
  };
  const _getQueues = () => {
    return {
      audioQueue
    }
  };
  return {
    init: _init,
    getQueues: _getQueues
  }
})();
