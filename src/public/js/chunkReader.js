(() => {
  const mergeArrayBuffers = (buff1, buff2) => {
    const newBuff = new Uint8Array(buff1.byteLength + buff2.byteLength);
    newBuff.set(new Uint8Array(buff1), 0);
    newBuff.set(new Uint8Array(buff2), buff1.byteLength);
    return newBuff;
  };

  const WAV_HEADER_BYTE_LENGTH = 44;

  const ChunkReader = (numberOfChannels = 2, sampleRate = 44100, durationThreshold = 10) => {
    // We need to define manually the number of samples based on configured channels so we can mark
    // it as the right 'frequency' to generate 1 second of playback, but based on the Nyquist-Shannon
    // theorem we need the double of the desired frequency that we need to produce
    const portionOfSamplesToProcess = sampleRate * numberOfChannels * 2;
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
    // Buffer samples until it reaches the correct number based on provided sample rate fo the playback
    let sampleBuffer = [];
    // Track if buffer is drained and we need to fetch more samples to resume playing
    let isDrained = true;

    const playAudioBuffer = (audioBuffer) => {
      lastNodeEndTime = lastNodeEndTime === null ? ctx.currentTime : lastNodeEndTime;
      source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(gain);
      gain.connect(ctx.destination);
      source.start(lastNodeEndTime);
      lastNodeEndTime += audioBuffer.duration;
    };

    const withWavHeader = (data) => {
      const header = new ArrayBuffer(WAV_HEADER_BYTE_LENGTH);
  
      const d = new DataView(header);
  
      d.setUint8(0, "R".charCodeAt(0));
      d.setUint8(1, "I".charCodeAt(0));
      d.setUint8(2, "F".charCodeAt(0));
      d.setUint8(3, "F".charCodeAt(0));
  
      d.setUint32(4, data.byteLength / 2 + WAV_HEADER_BYTE_LENGTH, true);
  
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

    const dequeueBuffer = () => {
      while (audioBuffers.length) {
        const audioBuffer = audioBuffers.pop();
        playAudioBuffer(audioBuffer);
      }
      isDrained = true;
    }

    const enqueueBuffer = (pcmData) => {
      // Remove portion of samples that will be used for the next audio node
      const pcmDataWithHeader = withWavHeader(Uint8Array.from(pcmData));
      ctx.decodeAudioData(pcmDataWithHeader.buffer, (audioBuffer) => {
        // Each AudioBuffer will have the duration of 1 second and the threshold will be measured in seconds
        audioBuffers.unshift(audioBuffer);
        if (audioBuffers.length >= durationThreshold && isDrained) {
          isDrained = false;
          dequeueBuffer();
        }
      });
    };

    const enqueueSamples = (chunk) => {
      const chunkUint8ArrayPresentation = Uint8Array.from(chunk);
      sampleBuffer.push(...chunkUint8ArrayPresentation);
      if (sampleBuffer.length >= portionOfSamplesToProcess) {
        const unitPlayback = sampleBuffer.slice(0, portionOfSamplesToProcess);
        sampleBuffer = sampleBuffer.slice(portionOfSamplesToProcess);
        enqueueBuffer(unitPlayback);
      }
    };

    return {
      enqueueSamples
    };
  };
  window.ChunkReader = ChunkReader;
})();
