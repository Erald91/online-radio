import * as stream from 'stream';

export default (() => {
  let _mainAudioStream = new stream.Transform({
    transform: function(chunk, encode, next) {
      this.push(chunk);
      next();
    }
  });
  const _getMainAudioStream = () => _mainAudioStream;
  return {
    getMainAudioStream: _getMainAudioStream,
  }
})();
