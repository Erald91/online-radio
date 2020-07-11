((window) => {
  window.onload = () => {
    const headers = new Headers();
    // Get supported AudioContext definition
    const AudioContext = (
      window.AudioContext ||
      window.webkitAudioContext ||
      window.mozAudioContext ||
      window.oAudioContext ||
      window.msAudioContext
    );
    // Check if Web Audio API is supported
    if (!AudioContext) {
      return console.log('Audio Context not supported!!!');
    }

    // Created audio context to be used for the sourcinng
    const audioContext = new AudioContext();
    // Store the decoded chunks in FIFO data structure
    const chunksQueue = new window.ObservableQueue();
    // Initiate ScheduleAduio service to handle audio chunk playing
    const scheduleAudioService = new window.ScheduleAudio(audioContext, chunksQueue);
    const unsubscribeQueued = chunksQueue.addListener('queue', (context) => {
      console.log('Queue: ', context);
      if (!scheduleAudioService.playing && context.items.length >= 100) {
        console.log('Ready')
        scheduleAudioService.play();
      }
    });
    const unsubscribeEnqueued = chunksQueue.addListener('enqueue', (context) => {
      console.log('Enqueued: ', context);
    });
    // Decode array buffer chunks to valid audio buffers with playable capabilities
    const decodeChunks = (arrayBuffer) => {
      return new Promise((resolve, reject) => {
        audioContext.decodeAudioData(arrayBuffer, resolve, (err) => resolve(null));
      });
    };
    const handleMp3Chunks = function({done, value}) {
      if (done) {
        console.log('Stream finished!!!');
        return;
      }
      decodeChunks(value.buffer)
        .then((audioBuffer) => {
          if (audioBuffer) {
            chunksQueue.queue(audioBuffer);
            console.log('[OK] Chunked queued: ', audioBuffer, ' Queue size: ', chunksQueue.items.length);
          } else {
            console.log('[ERROR] Chunk could not be decoded: ', value.buffer);
          }
          return this.read();
        })
        .then(handleMp3Chunks.bind(this))
    }
    headers.append('Accept', 'arrayBuffer');
    fetch('http://localhost:3000/stream', {method: 'GET', headers})
      .then((response) => {
        console.log('Received chunk request', response);
        const reader = response.body.getReader();
        reader.read().then(handleMp3Chunks.bind(reader));
      });
  };
})(window);