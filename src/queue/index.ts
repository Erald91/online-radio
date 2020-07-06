import AudioQueue from './Audio';

export default (() => {
  let audioQueue = null;

  const _init = () => {
    audioQueue = AudioQueue();
  };

  return {
    init: _init,
    audioQueue
  }
})();
