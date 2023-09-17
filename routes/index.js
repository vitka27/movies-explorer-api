const router = require('express').Router();
const { signupSchema, singinSchema } = require('../utils/validateJoi');
const { createUser, login } = require('../controllers/users');
const { NotFound } = require('../errors/index');
const auth = require('../middlewares/auth');

router.post('/signup', signupSchema, createUser);
router.post('/signin', singinSchema, login);

router.use(auth);

router.use('/users', require('./users'));
router.use('/movies', require('./movie'));

// обработка остальных роутов
router.use('*', (req, res, next) => {
  next(new NotFound('Страница не найдена'));
});

module.exports = router;
