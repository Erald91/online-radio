(() => {
  const mergeArrayBuffers = (buff1, buff2) => {
    const newBuff = new Uint8Array(buff1.byteLength + buff2.byteLength);
    newBuff.set(new Uint8Array(buff1), 0);
    newBuff.set(new Uint8Array(buff2), buff1.byteLength);
    return newBuff;
  };

  const ChunkReader = (numberOfChannels = 2, sampleRate = 44800, samplesThreshold = sampleRate * 5) => {
    // Keep reference of AudioContext instance to handle the audio graph
    const ctx = new AudioContext();
    // Define the sample rate of the ctx
    ctx.sampleRate = sampleRate;
    // Queue of ArrayBuffers presenting chunks of the streaming audio file
    let audioBuffers = [];
    // Create gain node that will allow to control the amplitude of the sound
    let gain = ctx.createGain();
    // Define initial value of the gain node to equal to '1'
    gain.gain.value = 1;
    let source = null;
    // Define initial value of the last 'position' in time where the other node should proceed
    let lastNodeEndTime = null;
    // Keep track of state when all samples are consumed and buffer is empty
    let isDrained = true;

    const playAudioBuffer = (audioBuffer) => {
      lastNodeEndTime = lastNodeEndTime === null ? ctx.currentTime : lastNodeEndTime;
      source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(gain);
      gain.connect(ctx.destination);
      source.start(lastNodeEndTime);
      source.addEventListener('ended', onNodeEnded.bind(source));
      lastNodeEndTime += audioBuffer.duration;
    };

    const onNodeEnded = function(currentNode) {
      if (currentNode === source && !audioBuffers.length) {
        console.log('Played last audio node and buffer is empty...');
        isDrained = true;
      }
    }

    const withWavHeader = (data) => {
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

    const dequeueBuffer = (callback) => {
      // Remove portion of samples that will be used for the next audio node
      const pcmData = audioBuffers.splice(-(sampleRate - 44));
      const pcmDataWithHeader = withWavHeader(Uint8Array.from(pcmData));
      ctx.decodeAudioData(pcmDataWithHeader.buffer, (audioBuffer) => {
        callback(audioBuffer);
      });
    };

    const enqueueBuffer = (chunk) => {
      // Convert ArrayBuffer to 8bit PCM data and serialize all the samples
      const fromArrayBufferToUintArray = new Uint8Array(chunk);
      // Push all samples to inner reference buffer so we can keep reference on it
      audioBuffers.unshift(...fromArrayBufferToUintArray);
      if (audioBuffers.length < samplesThreshold && isDrained) {
        return;
      }
      isDrained = false;
      // Dequeue and schedule next node on the graph to resume as soon the previous has finished 
      dequeueBuffer((audioBuffer) => playAudioBuffer(audioBuffer));
    };

    return {
      enqueue: enqueueBuffer
    };
  };
  window.ChunkReader = ChunkReader;
})();
