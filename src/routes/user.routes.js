const usersController = require('../controllers/users.controller');
const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');

const userMiddleware = require('../middlewares/user.middleware');

router.post('/signup', usersController.createUser);

router.post('/login', usersController.login);

router.use(authMiddleware.protect);

router
  .use('/:id', userMiddleware.existUser)
  .route('/:id')
  .patch(authMiddleware.protectAccountOwner, usersController.update)
  .delete(authMiddleware.protectAccountOwner, usersController.delete);

module.exports = router;
