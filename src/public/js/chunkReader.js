(() => {
  const mergeArrayBuffers = (buff1, buff2) => {
    const newBuff = new Uint8Array(buff1.byteLength + buff2.byteLength);
    newBuff.set(new Uint8Array(buff1), 0);
    newBuff.set(new Uint8Array(buff2), buff1.byteLength);
    return newBuff;
  };

  // Set a default threshold for the buffer in BYTES so we now
  // when we have enough data to start playing or when we need 
  // to stop to wait for more
  const BUFFER_THRESHOLD =  10000; // IN BYTES

  const ReaderAudioBuffer = (bytes, audioBuffer) => ({bytes, audioBuffer});

  const ChunkReader = () => {
    // Keep reference of AudioContext instance to handle the audio graph
    const ctx = new AudioContext();
    // Queue of ArrayBuffers presenting chunks of the streaming audio file
    let audioBuffers = [];
    // Create gain node that will allow to control the amplitude of the sound
    let gain = ctx.createGain();
    gain.gain.value = 1;
    let source = null

    const playAudioBuffer = (audioBuffer) => {
      source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(gain);
      gain.connect(ctx.destination);
      source.start(0);
      source.addEventListener('ended', () => dequeueBuffer());
    };

    const withWavHeader = (data, numberOfChannels, sampleRate) => {
      const header = new ArrayBuffer(44);
  
      const d = new DataView(header);
  
      d.setUint8(0, "R".charCodeAt(0));
      d.setUint8(1, "I".charCodeAt(0));
      d.setUint8(2, "F".charCodeAt(0));
      d.setUint8(3, "F".charCodeAt(0));
  
      d.setUint32(4, data.byteLength / 2 + 44, true);
  
      d.setUint8(8, "W".charCodeAt(0));
      d.setUint8(9, "A".charCodeAt(0));
      d.setUint8(10, "V".charCodeAt(0));
      d.setUint8(11, "E".charCodeAt(0));
      d.setUint8(12, "f".charCodeAt(0));
      d.setUint8(13, "m".charCodeAt(0));
      d.setUint8(14, "t".charCodeAt(0));
      d.setUint8(15, " ".charCodeAt(0));
  
      d.setUint32(16, 16, true);
      d.setUint16(20, 1, true);
      d.setUint16(22, numberOfChannels, true);
      d.setUint32(24, sampleRate, true);
      d.setUint32(28, sampleRate * 1 * 2);
      d.setUint16(32, numberOfChannels * 2);
      d.setUint16(34, 16, true);
  
      d.setUint8(36, "d".charCodeAt(0));
      d.setUint8(37, "a".charCodeAt(0));
      d.setUint8(38, "t".charCodeAt(0));
      d.setUint8(39, "a".charCodeAt(0));
      d.setUint32(40, data.byteLength, true);
  
      return mergeArrayBuffers(header, data);
    };

    const hasEnoughBufferedDataToResume = () => {
      let total = 0;
      for (const playerBuffer of audioBuffers) {
        total += playerBuffer.bytes;
        if (total >= BUFFER_THRESHOLD) {
          return true;
        }
      }
      return false
    };

    const dequeueBuffer = () => {
      const nextPlayerBuffer = audioBuffers.pop();
      console.log('Play chunk', nextPlayerBuffer);
      playAudioBuffer(nextPlayerBuffer.audioBuffer);
    };

    const enqueueBuffer = (chunk) => {
      const chunkWithHeader = withWavHeader(chunk, 2, 44800);
      const bytes = chunkWithHeader.byteLength;
      ctx.decodeAudioData(chunkWithHeader.buffer, (audioBuffer) => {
        // Include audioBuffer with related data to the queue ready to be processed
        audioBuffers.unshift(ReaderAudioBuffer(bytes, audioBuffer));
        const canPlay = hasEnoughBufferedDataToResume();
        console.log('Decode data', canPlay, source);
        if (canPlay && !source) {
          return dequeueBuffer();
        }
        console.log('Not enough data to play, waiting ...');
      });
    };

    return {
      enqueue: enqueueBuffer
    };
  };
  window.chunkReader = ChunkReader();
})();