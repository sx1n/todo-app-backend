/* eslint-disable no-process-env */

import logger from './logger';

const enviroment = [
  'NODE_ENV',
  'SERVER_PORT',
  'SERVER_HOST',
  'DB_USER',
  'DB_PASS',
  'DB_HOST',
  'DB_PORT',
  'DB_NAME'
];

enviroment.forEach((variable) => {
  if (!process.env[variable]) {
    logger.error(`missing ${variable}`);
    throw new Error(`${variable}: ${process.env[variable]}`);
  }
});

export default {
  NODE_ENV : `${process.env.NODE_ENV}`,
  DB_PORT  : `${process.env.DB_PORT}`,
  DB_NAME  : `${process.env.DB_NAME}`,
  DB_USER  : `${process.env.DB_USER}`,
  DB_PASS  : `${process.env.DB_PASS}`,
  DB_HOST  : `${process.env.DB_HOST}`,
  SERVER_HOST: `${process.env.SERVER_HOST}`,
  SERVER_PORT: `${process.env.SERVER_PORT}`,
  BCRYPT_SALT: Number(`${process.env.BCRYPT_SALT}`),
  JWT_SECRET: `${process.env.JWT_SECRET}`,
  JWT_EXPIRATION: `${process.env.JWT_EXPIRATION}`
};
