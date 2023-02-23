import 'express-async-errors';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import gzip from 'compression';

import logger from './config/logger';
import { mongodbInit } from './database';

import routes from './routes';

import { errorHandler } from './middlewares/errorHandler';

export const app = express();

mongodbInit()
  .then(() => app.emit('MongoDB Connected'))
  .catch(error => logger.error(error));

app.use(helmet());
app.use(cors());
app.use(gzip());

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

app.use(routes);

app.use(errorHandler);
