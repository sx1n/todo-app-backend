import { app } from './app';
import logger from './config/logger';
import config from './config';

const { SERVER_HOST, SERVER_PORT, NODE_ENV } = config;

app.on('MongoDB Connected', () => {

  logger.info('[MongoDB]: Connected');

  app.listen(SERVER_PORT, SERVER_HOST, () => {
    logger.info(`[Express]: Running on ${SERVER_HOST}:${SERVER_PORT}`);

    if (!NODE_ENV) {
      for (const env in config) logger.info(`${env}: ${config[env]}`);
    }
  });

});
