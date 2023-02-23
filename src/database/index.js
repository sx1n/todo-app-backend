import mongoose, { connection } from 'mongoose';
import config from '../config';
import logger from '../config/logger';

const { DB_PORT, DB_NAME, DB_USER, DB_PASS, DB_HOST } = config;

const uri = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

export async function mongodbInit() {
  mongoose.set('strictQuery', true);

  await mongoose.connect(uri);

  connection.on('error', (err) => {
    logger.error('[MongoDB]:', err.message);
  });
}

