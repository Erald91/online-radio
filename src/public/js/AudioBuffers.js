(() => {
  const AudioBuffers = (ctx, thresholdDuration = 5, gain = null) => {
    // Create internal list implementation that will store the audio buffers
    const list = window.LinkedList(null);
    // Use isDrained flag to determinate if buffer should wait to fill with needed duration to resume 
    let isDrained = true;
    // Keep reference of the node that's current playing
    let currentNode = null;
    // Subsribe to events and emit them
    let events = window.EventEmitter();

    const _play = () => {
      // Get the first added audio buffer not yet processed
      const node = list.head();
      if (!node) {
        isDrained = true;
        events.emit('drained');
        return;
      }
      const {data: audioBuffer} = node;
      currentNode = ctx.createBufferSource();
      currentNode.buffer = audioBuffer;
      if (gain) {
        currentNode.connect(gain);
        gain.connect(ctx.destination);
      } else {
        currentNode.connect(ctx.destination);
      }
      currentNode.start();
      currentNode.addEventListener('ended', () => {
        _dequeue();
        currentNode = null;
        _play();
      })
    }

    const _dequeue = () => {
      list.deleteAtBeginning();
    }

    const _enqueue = (audioBuffer) => {
      // Insert the new audioBuffer at the end of the list so it can be processed in queue order
      list.insertAtEnd(audioBuffer);
      // In case buffer is drained and we have enough data to resume playing, we can start playback
      if (isDrained && _checkCurrentDownloadedDuration() > thresholdDuration) {
        isDrained = false;
        events.emit('ready');
        _play();
      }
    }

    const _checkCurrentDownloadedDuration = () => {
      return list.traverse().reduce((duration, audioBuffer) => {
        return duration + audioBuffer.duration;
      }, 0);
    }

    return {
      enqueue: _enqueue,
      on: (name, func) => events.on(name, func),
      off: (name, func) => events.off(name, func)
    }
  }
  window.AudioBuffers = AudioBuffers;
})();
