const router = require('express').Router();

const {
  createMovie, findAllMovies, deleteMovie,
} = require('../controllers/movie');
const { createMovieSchema, deleteMovieSchema } = require('../utils/validateJoi');

// возвращает все сохранённые текущим пользователем фильмы
router.get('/', findAllMovies);

// создаёт фильм с переданными в теле country, director, duration, year, description,
// image, trailer, nameRU, nameEN и thumbnail, movieId
router.post('/', createMovieSchema, createMovie);

// удаляет сохранённый фильм по id
router.delete('/:_id', deleteMovieSchema, deleteMovie);

module.exports = router;
