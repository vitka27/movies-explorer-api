const movieSchema = require('../models/movie');
const { BadRequest, NotFound, Forbidden } = require('../errors/index');

// возвращает все сохранённые текущим пользователем фильмы
module.exports.findAllMovies = (req, res, next) => {
  movieSchema.find({ owner: req.user._id }).sort({ createdAt: '-1' })
    .then((movie) => res.send(movie))
    .catch(next);
};

// создаёт фильм с переданными в теле данными
module.exports.createMovie = (req, res, next) => {
  movieSchema.create({ owner: req.user._id, ...req.body })
    .then((movie) => res.status(201).send(movie))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании карточки фильма'));
      } else {
        next(error);
      }
    });
};

// удаляем сохранённый фильм по id
module.exports.deleteMovie = (req, res, next) => {
  movieSchema.findById(req.params._id)
    .orFail(() => { throw new Error('NotFound'); })
    .then((movie) => {
      if (req.user._id === movie.owner.toString()) {
        return movieSchema.deleteOne({ _id: req.params._id }).then(() => res.send({ message: 'Карточка фильма успешно удалена' }));
      }
      return next(new Forbidden('Нельзя удалить чужую карточку фильма'));
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Передан некорректный id фильма'));
      } else if (error.message === 'NotFound') {
        next(new NotFound(`Карточка фильма с указанным id (${req.params._id}) не найдена`));
      } else {
        next(error);
      }
    });
};
