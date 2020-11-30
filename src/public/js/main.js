(() => {
  window.onload = () => {
    const socket = io();

    const chunkReader = window.ChunkReader();

    socket.on('connect', () => {
      console.log('Connection established with server...');
      socket.emit('request', 'lorem ipsum');
    });

    socket.on('reconnecting', () => {
      console.log('Reconnecting with server...');
    });

    socket.on('reconnect_error', () => {
      console.log('Reconnecting with server failed...');
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected from server...');
    });

    ss(socket).on('stream', (stream) => {
      stream.on('data', (chunk) => {
        chunkReader.enqueue(chunk);
      });
    });
  };
})();
