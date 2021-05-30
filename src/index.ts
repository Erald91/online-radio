require('dotenv').config();
import HttpServer from './HttpServer';
import Events from './events';
import Database from './database/Database';

(() => {
  Events.registerListeners();
  Database.init();
  HttpServer();
})();
