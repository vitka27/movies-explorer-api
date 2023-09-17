const router = require('express').Router();
const { updateMeProfileSchema } = require('../utils/validateJoi');

const { findMeProfile, updateMeProfile } = require('../controllers/users');

// GET /users/me - возвращает информацию о пользователе (email и имя)
router.get('/me', findMeProfile);

// PATCH /users/me — обновляет информацию о пользователе (email и имя)
router.patch('/me', updateMeProfileSchema, updateMeProfile);

module.exports = router;
