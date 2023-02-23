import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import isEmail from 'validator/lib/isEmail';

import User from '../schemas/User';

import { BadRequestError } from '../helpers/apiErrors';

import config from '../config';

const { JWT_SECRET, JWT_EXPIRATION } = config;


function generateToken(params = {}) {
  return jwt.sign(params, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION
  });
}

class AuthController {
  async register(req, res) {
    const { username, email, password } = req.body;

    if (!isEmail(email)) {
      throw new BadRequestError('E-mail inválido');
    }

    const invalidPassword = password.length < 8 || password.length > 125;

    const invalidUsername = username.length < 3;

    if (invalidPassword) {
      throw new BadRequestError('Tamanho de senha inválido');
    }

    if (invalidUsername) {
      throw new BadRequestError('Nome de Usuário Inválido');
    }

    const sameEmail = await User.findOne({ email });

    const sameUsername = await User.findOne({ username });

    if (sameEmail) {
      throw new BadRequestError('E-mail em uso');
    }

    if (sameUsername) {
      throw new BadRequestError('Nome de Usuário em uso');
    }

    const user = await User.create({ username, email, password });

    user.password = undefined;

    return res.status(201).json({
      user,
      token: generateToken({
        id: user.id,
        email: user.email
      })
    });

  }

  async auth(req, res) {
    const { email, password } = req.body;

    if (!isEmail(email)) {
      throw new BadRequestError('E-mail ou senha inválidos');
    }

    const invalidPassword = password.length < 8 || password.length > 125;

    if (invalidPassword) {
      throw new BadRequestError('E-mail ou senha inválidos');
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new BadRequestError('E-mail ou senha inválidos');
    }


    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new BadRequestError('E-mail ou senha inválidos');
    }


    user.password = undefined;

    return res.status(200).json({
      user,
      token: generateToken({
        id: user.id,
        email: user.email
      })
    });
  }
}

export default new AuthController();
