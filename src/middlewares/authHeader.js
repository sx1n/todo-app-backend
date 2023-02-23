import jwt from 'jsonwebtoken';

import { BadRequestError } from '../helpers/apiErrors';

import config from '../config';

const { JWT_SECRET } = config;

export function authHeader(req, res, next) {
  const authorization = req.headers.authorization || undefined;

  if (!authorization) {
    return next();
  }

  const [, token] = authorization.split(' ');

  try {
    const { id, email } = jwt.verify(token, JWT_SECRET);

    req.userId = id;
    req.userEmail = email;

    return next();
  } catch {
    throw new BadRequestError('Token Inválido');
  }
}
