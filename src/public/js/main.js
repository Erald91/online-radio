(() => {
  window.onload = () => {
    const socket = io();

    socket.on('connect', () => {
      console.log('Connection established with server...')
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
  };
})();
