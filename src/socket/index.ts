import { Socket, Server as SocketServer, ServerOptions } from 'socket.io';
import { RedisClient } from 'redis';
import { createAdapter } from 'socket.io-redis';
import { Server } from 'http';
import appConfig from '../configs/appConfig';

const DEFAULT_SOCKET_OPTIONS: Partial<ServerOptions> = Object.freeze({});

export default (() => {
  let _server: SocketServer = null;
  const _init = (httpServer: Server, options: Partial<ServerOptions> = {}) => {
    _server = new SocketServer(httpServer, {...DEFAULT_SOCKET_OPTIONS, ...options});
    // Define Redis adapter for the Socket server instance
    const pubClient = new RedisClient({host: appConfig.redis.host, port: appConfig.redis.port});
    const subClient = pubClient.duplicate();
    _server.adapter(createAdapter({pubClient, subClient}));

    _server.on('connection', (socket: Socket) => {
      socket.on('disconnect', () => {
        console.log(`[SOCKET]|Client#${socket.id} disconnected...`);
      });
      console.log(`[SOCKET]|Client#${socket.id} connected...`)
    });
  };
  const _getServer = () => _server; 
  return {
    init: _init,
    getServer: _getServer
  };
})();
