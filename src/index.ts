require('dotenv').config();
import HttpServer from './HttpServer';
import Queue from './queue';
import Events from './events';
import Database from './database/Database';

(() => {
  Events.registerListeners();
  Queue.init();
  Database.init();
  HttpServer();
})();
