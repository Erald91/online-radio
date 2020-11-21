import { Socket, Server as SocketServer, ServerOptions } from 'socket.io';
import { RedisClient } from 'redis';
import { createAdapter } from 'socket.io-redis';
import { Server } from 'http';
import appConfig from '../configs/appConfig';

const DEFAULT_SOCKET_OPTIONS: Partial<ServerOptions> = Object.freeze({});

export default (() => {
  let _server: SocketServer = null;
  let connectedSockets: Array<Socket> = [];
  const _init = (httpServer: Server, options: Partial<ServerOptions> = {}) => {
    _server = new SocketServer(httpServer, {...DEFAULT_SOCKET_OPTIONS, ...options});
    // Define Redis adapter for the Socket server instance
    const pubClient = new RedisClient({host: appConfig.redis.host, port: appConfig.redis.port});
    const subClient = pubClient.duplicate();
    _server.adapter(createAdapter({pubClient, subClient}));

    _server.on('connection', (socket: Socket) => {
      socket.on('disconnect', () => {
        console.log(`[SOCKET]|Client#${socket.id} disconnected...`);
        // In case socket is disconnected we should remove from the list
        _removeSocket(socket.id);
      });
      // Add socket to the list of saved connections
      _addSocket(socket);
    });
  }
  const _addSocket = (socket: Socket) => {
    console.log(`[SOCKET]|Client#${socket.id} connected...`)
    connectedSockets.push(socket);
  };
  const _removeSocket = (socketId: string) => {
    connectedSockets = connectedSockets.reduce(
      (collection: Array<Socket>, socket: Socket) =>
        socket.id !== socketId ? collection.concat([socket]) : collection,
        []
      );
  };
  const _getConnectedSockets = () => connectedSockets;
  return {
    init: _init,
    getConnectedSockets: _getConnectedSockets
  };
})();
