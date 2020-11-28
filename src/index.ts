require('dotenv').config();
import HttpServer from './HttpServer';
import Queue from './queue';
import Events from './events';

Events.registerListeners();
Queue.init();
HttpServer();

Queue.getQueues().audioQueue.startTestPlaylist();
