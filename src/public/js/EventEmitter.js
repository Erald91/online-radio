(() => {
  const EventEmitter = () => {
    let events = {};

    const _on = (name, func) => {
      if (events[name]) {
        events[name].push(func);
      } else {
        events[name] = [func];
      }
    }

    const _off = (name, func) => {
      if (!events[name]) {
        return;
      }
      events[name] = events[name].filter(listener => listener !== func);
    }

    const _emit = (name, ctx = null) => {
      if (!events[name]) {
        return;
      }
      events[name].forEach(listener => {
        listener(ctx);
      });
    }

    return {
      on: _on,
      off: _off,
      emit: _emit
    };
  };
  window.EventEmitter = EventEmitter;
})();
