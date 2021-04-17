require('dotenv').config();
import Database from '../database/Database';

(async () => {
  await Database.init();
  await Database.seed();
  await Database.close();
  process.exit(0);
})();
