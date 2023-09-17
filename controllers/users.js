const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { BadRequest, NotFound, Conflict } = require('../errors/index');

const { PRIVATE_KEY = 'bitfilmsdb' } = process.env;

// создаёт пользователя с переданными в теле email, password и name
module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      email, password: hash, name,
    })
      .then((user) => res.status(201).send({ data: { ...user.toJSON(), password: undefined } }))
      .catch((error) => {
        if (error.name === 'ValidationError') {
          next(new BadRequest('Переданы некорректные данные при создании пользователя'));
        } else if (error.code === 11000) {
          next(new Conflict('Пользователь уже существует'));
        } else {
          next(error);
        }
      });
  });
};

// аутентификация пользователя
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, PRIVATE_KEY, { expiresIn: '7d' });
      res.status(200).send({ token });
    })
    .catch(next);
};

// возвращает информацию о пользователе (email и имя)
module.exports.findMeProfile = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch((next));
};

// обновляет информацию о пользователе (email и имя)
module.exports.updateMeProfile = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { ...req.body },
    { new: true, runValidators: true },
  )
    .orFail(() => { throw new Error('NotFound'); })
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении профиля'));
      } else if (error.message === 'NotFound') {
        next(new NotFound(`Пользователь с указанным id (${req.user._id}) не найден`));
      } else {
        next(error);
      }
    });
};
