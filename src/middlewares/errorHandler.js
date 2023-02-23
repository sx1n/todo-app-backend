/* eslint-disable no-unused-vars */
import logger from '../config/logger';

export function errorHandler(err, req, res, next) {

  if (!err.statusCode) logger.error(err);

  const statusCode = err.statusCode ?? 500;
  const error = err.statusCode ? err.message : 'Internal Server Error';

  return res.status(statusCode).json({ error });
}
