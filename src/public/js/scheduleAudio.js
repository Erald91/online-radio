(() => {
  const ScheduleAudio = function(audioContext, buffersQueue = []) {
    this.audioContext = audioContext;
    this.buffersQueue = buffersQueue;
    this.currentTime = 0;
    this.playing = false;
    this.audioBufferSource = null;
  };
  ScheduleAudio.prototype.play = function() {
    this.playing = true;
    this.consumeBuffers();
  }
  ScheduleAudio.prototype.consumeBuffers = function() {
    console.log('Consuming!!!', this.buffersQueue.items.length);
    if (!this.playing) {
      console.log('[Schedule] Playing is disabled');
      return;
    }

    if (!this.buffersQueue.items.length) {
      console.log('[Schedule] Buffers Queue is empty');
      return;
    }

    if (this.audioBufferSource) {
      this.audioBufferSource.stop(this.audioContext.currentTime);
    }
    
    const buffer = this.buffersQueue.enqueue();
    // this.audioContext.sampleRate = buffer.sampleRate;
    this.audioBufferSource = this.audioContext.createBufferSource();
    this.audioBufferSource.buffer = buffer;
    this.audioBufferSource.connect(this.audioContext.destination);
    if (!this.currentTime) {
      this.currentTime = this.audioContext.currentTime;
    }
    this.audioBufferSource.start(this.audioContext.currentTime);
    setTimeout(this.consumeBuffers.bind(this), buffer.duration * 1000);
  }
  ScheduleAudio.prototype.stop = function() {
    this.playing = false;
    if (this.audioBufferSource) {
      this.audioBufferSource.stop();
    }
  }
  window.ScheduleAudio = ScheduleAudio;
})();
