import { isValidObjectId } from 'mongoose';

import List from '../schemas/List';
import User from '../schemas/User';
import Task from '../schemas/Task';

import { BadRequestError, UnauthorizedError } from '../helpers/apiErrors';

import { isValidQuery } from '../libs/isValidQuery';

class ListController {
  async index(req, res) {
    const { userId } = req;
    const { sort = '1', limit = '9', skip = '0' } = req.query;

    if (!isValidObjectId(userId)) {
      throw new
      BadRequestError('Seu ID de Usuário é inválido, faça login novamente');
    }

    const invalidQuery = isValidQuery(sort, limit, skip);

    if (invalidQuery) {
      throw new BadRequestError('Query inválida');
    }

    const lists = await List.find({ user: userId })
      .populate(['user', 'tasks'])
      .sort({ name: sort })
      .limit(limit)
      .skip(skip);

    if (lists.length === 0) return res.status(204).json(lists);

    return res.status(200).json(lists);
  }

  async show(req, res) {
    const { listId } = req.params;
    const { userId } = req;

    if (!isValidObjectId(listId)) {
      throw new BadRequestError('Id de Lista inválido');
    }

    const list = await List.findById(listId).populate(['user', 'tasks']);

    if (!list) {
      throw new BadRequestError('A Lista não exite');
    }

    const privateList = list.privateList && userId !== String(list.user._id);

    if (privateList) {
      throw new UnauthorizedError('A Lista é privada');
    }

    return res.status(200).json(list);
  }

  async create(req, res) {
    const { name, tasks, privateList } = req.body;
    const { userId } = req;

    if (!isValidObjectId(userId)) {
      throw new
      BadRequestError('Seu ID de Usuário é inválido, faça login novamente');
    }

    if (!name) {
      throw new BadRequestError('A Lista deve conter um nome');
    }

    const list = await List.create({ name, privateList, user: userId });

    if (!tasks) {
      return res.status(201).json(list);
    }

    await Promise.all(tasks.map(async (task) => {
      const listTask = new Task({ ...task, list: list._id });

      await listTask.save();

      list.tasks.push(listTask);
    }));

    await list.save();

    return res.status(201).json(list);
  }

  async update(req, res) {
    const { name, tasks, privateList } = req.body;
    const { userId } = req;
    const { listId } = req.params;

    if (!isValidObjectId(userId)) {
      throw new
      BadRequestError('Seu ID de Usuário é inválido, faça login novamente');
    }

    if (!isValidObjectId(listId)) {
      throw new BadRequestError('Id de Lista inválido');
    }

    const list = await List.findById(listId);

    if (!list) {
      throw new BadRequestError('A Lista não existe');
    }

    const notAllowed = userId != String(list.user);

    if (notAllowed) {
      throw new
      UnauthorizedError('Você não pode alterar a lista de outra pessoa');
    }

    if (!tasks) {
      const listUpdated = await List.findByIdAndUpdate(listId, {
        name,
        privateList
      }, { new: true }).populate('tasks');

      return res.status(200).json(listUpdated);
    }

    const listUpdated = await List.findByIdAndUpdate(listId, {
      name,
      privateList
    }, { new: true });

    listUpdated.tasks = [];

    await Task.deleteMany({ list: listUpdated._id });

    await Promise.all(tasks.map(async (task) => {
      const listTask = new Task({ ...task, list: listUpdated._id });

      await listTask.save();

      listUpdated.tasks.push(listTask);
    }));

    await listUpdated.save();

    return res.status(200).json(listUpdated);
  }

  async delete(req, res) {
    const { listId } = req.params;
    const { userId } = req;

    if (!isValidObjectId(userId)) {
      throw new
      BadRequestError('Seu ID de Usuário é inválido, faça login novamente');
    }

    if (!isValidObjectId(listId)) {
      throw new BadRequestError('Id de Lista inválido');
    }

    const list = await List.findById(listId);

    if (!list) {
      throw new BadRequestError('A Lista não existe');
    }

    const notAllowed = userId != String(list.user);

    if (notAllowed) {
      throw new
      UnauthorizedError('Você não pode deletar a lista de outra pessoa');
    }

    await list.deleteOne({ _id: list._id });

    return res.status(200).json({ deleted: true });
  }

  async search(req, res) {
    const {
      username = '',
      listName: list = '',
      sort = '1',
      limit = '9',
      skip = '0'
    } = req.query;

    const { userId } = req;

    const invalidQuery = isValidQuery(sort, limit, skip);

    if (invalidQuery) {
      throw new BadRequestError('Query inválida');
    }

    const query = {
      name: { $regex: list, $options: 'i' },
      $or: [
        { privateList: false },
        { privateList: true, user: userId },
      ],
      user: {
        $in: await User.find({
          username: { $regex: username, $options: 'i' }
        }).distinct('_id')
      }
    };

    const lists = await List.find(query)
      .populate(['user', 'tasks'])
      .sort(sort)
      .limit(limit)
      .skip(skip);

    if (lists.length === 0) {
      return res.status(204).json(lists);
    }

    return res.status(200).json(lists);
  }
}

export default new ListController();
