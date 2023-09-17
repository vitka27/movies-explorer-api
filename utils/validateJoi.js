const { Joi, celebrate } = require('celebrate');
const patterns = require('./patterns');

//* ------------------ user validation ----------------------
const signupSchema = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
});

const singinSchema = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const updateMeProfileSchema = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email(),
  }),
});

//* ------------------ movie validation ----------------------
const createMovieSchema = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().pattern(patterns.url).required(),
    trailerLink: Joi.string().pattern(patterns.url).required(),
    thumbnail: Joi.string().pattern(patterns.url).required(),
    owner: Joi.object().keys({
      _id: Joi.string().hex().length(24).required(),
    }),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const deleteMovieSchema = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  signupSchema,
  singinSchema,
  updateMeProfileSchema,
  createMovieSchema,
  deleteMovieSchema,
};
