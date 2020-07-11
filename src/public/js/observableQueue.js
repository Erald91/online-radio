(() => {
  const Queue = window.Queue;
  const ObservableQueue = function(items = [], reverse = false) {
    Queue.call(this, items, reverse);
    this.listeners = {queue: [], enqueue: []};
  }
  ObservableQueue.prototype = Object.create(Queue.prototype);
  ObservableQueue.prototype.addListener = function(event, listener) {
    const eventListenersBag = this.listeners[event];
    // Push listener to the requested bag
    eventListenersBag.push(listener);
    // Get the index of the last added listener
    const listenerIndex = this.listeners.queue.length - 1;

    // Return the 'unsubscribe' function
    return function() {
      this.listeners.splice(listenerIndex, 1);
    }
  }
  ObservableQueue.prototype.queue = function(...items) {
    Queue.prototype.queue.call(this, ...items);
    for (let listener of this.listeners.queue) {
      listener(this);
    }
  }
  ObservableQueue.prototype.enqueue = function() {
    for (let listener of this.listeners.enqueue) {
      listener(this);
    }
    return Queue.prototype.enqueue.call(this);
  }
  ObservableQueue.prototype.clearAllListeners = function() {
    this.listeners = {queue: [], enqueue: []};
  }
  window.ObservableQueue = ObservableQueue;
})();