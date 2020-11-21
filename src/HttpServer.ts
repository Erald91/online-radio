import * as http from 'http';
import * as express from 'express';
import { IError } from './errors/IError';
import AppConfig from './configs/appConfig';
import { AddressInfo } from 'net';
import SocketService from './socket';

export default () => {
  const app: express.Application = express();

  app.use('/static', express.static(`${__dirname}/public`));

  app.get('/version', (req: express.Request, res: express.Response) => {
    res.status(200).end(`Build v${AppConfig.buildVersion}`);
  });

  app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).end(`Kodek Online Streaming Radio`);
  });

  app.use((err: IError, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(err.status).end(err.message);
  });

  // Create HTTP server that will serve the support for the UI
  const server = http.createServer(app);

  // Initiate socket server under the same existing HTTP server
  SocketService.init(server);

  server.listen(AppConfig.port, () => {
    console.log('Server listenting in port: %s', (server.address() as AddressInfo).port);
  });
};
