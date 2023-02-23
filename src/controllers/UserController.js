import { isValidObjectId } from 'mongoose';

import User from '../schemas/User';

import { BadRequestError, UnauthorizedError } from '../helpers/apiErrors';

class UserController {
  async update(req, res) {
    const { id } = req.params;
    const { userId, userEmail } = req;
    const { username } = req.body;

    if (!isValidObjectId(id)) {
      throw new
      BadRequestError('Não foi possível encontrar o Usuário, Id inválido');
    }

    if (!isValidObjectId(userId)) {
      throw new
      BadRequestError('Seu ID de Usuário é inválido, faça login novamente');
    }

    const user = await User.findById(id);

    if (!user) {
      throw new BadRequestError('Usuário não encontrado');
    }

    const notAllowed = (userId != String(user._id))
      && (userEmail != String(user.email));

    const sameNickname = (user.username === username);

    if (notAllowed) {
      throw new
      UnauthorizedError('Você não pode alterar dados de outros Usuários');
    }

    if (sameNickname) {
      throw new BadRequestError('Foi fornecido o mesmo nome de Usuário');
    }

    const userAlreadyExists = await User.findOne({ username });

    if (userAlreadyExists) {
      throw new BadRequestError('Nome de usuário em uso');
    }

    const userUpdated = await User.findByIdAndUpdate(userId, {
      username
    }, { new: true });

    return res.status(200).json(userUpdated);
  }

  async delete(req, res) {
    const { id } = req.params;
    const { userId, userEmail } = req;

    if (!isValidObjectId(id)) {
      throw new
      BadRequestError('Não foi possível encontrar o Usuário, Id inválido');
    }

    if (!isValidObjectId(userId)) {
      throw new
      BadRequestError('Seu ID de Usuário é inválido, faça login novamente');
    }

    const user = await User.findById(id);

    if (!user) {
      throw new BadRequestError('Usuário não existe');
    }

    const notAllowed = (userId !== user._id) && (userEmail !== user.email);

    if (notAllowed) {
      throw new UnauthorizedError('Você não pode deletar outros Usuários');
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({ deleted: true });
  }
}

export default new UserController();
