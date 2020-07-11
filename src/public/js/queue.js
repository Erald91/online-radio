(() => {
  const Queue = function(items = [], reverse = false) {
    this.items = [...items];
    this.reverse = false;
  }
  Queue.prototype.queue = function(...items) {
    this.reverse ? this.items.push(...items) : this.items.unshift(...items);
  }
  Queue.prototype.enqueue = function() {
    return this.reverse ? this.items.shift() : this.items.pop();
  };
  window.Queue = Queue;
})();