(() => {
  const AudioBuffers = (ctx, gain = null) => {
    // Subscribe to events and emit them
    const events = window.EventEmitter();
    // Relative 'Start Time' that will mark start of each audio node
    let startTime = null;

    const _play = (audioBuffer) => {
      const currentNode = ctx.createBufferSource();
      currentNode.buffer = audioBuffer;
      if (gain) {
        currentNode.connect(gain);
        gain.connect(ctx.destination);
      } else {
        currentNode.connect(ctx.destination);
      }
      if (!startTime) {
        startTime = ctx.currentTime;
      }
      currentNode.start(startTime);
      startTime += audioBuffer.duration;
    };

    const _enqueue = (audioBuffer) => {
      _play(audioBuffer);
    };

    return {
      enqueue: _enqueue,
      on: (name, func) => events.on(name, func),
      off: (name, func) => events.off(name, func)
    };
  }
  window.AudioBuffers = AudioBuffers;
})();
