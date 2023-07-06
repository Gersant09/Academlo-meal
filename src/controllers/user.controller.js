const AppError = require('./../utils/appError');
const bcrypt = require('bcryptjs');
const catchAsync = require('../utils/catchAsync');
const generateJWT = require('../utils/jwt');

const User = require('../models/user.model');
const { UPDATE } = require('sequelize/types/query-types');

exports.create = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const salt = await bcrypt.genSalt(12);
  const encryptedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name: name.toLowerCase(),
    email: email.toLowerCase(),
    password: encryptedPassword,
    role,
  });

  const token = await generateJWT(user.id);

  res.status(201).json({
    status: 'success',
    message: 'el usuario fue creado',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: {
      email: email.toLowerCase(),
      status: true,
    },
  });
  if (!user) {
    return next(new AppError('usuario no encontrado', 404));
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError('informacion incorrecta'));
  }
});

exports.update = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { name, email } = req.body;

  await user.update({ name, email });

  return res.status(200).json({
    status: 'success',
    message: 'user has been update 😉',
  });
});

exports.delete = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: false });

  return res.status(200).json({
    status: 'success',
    message: 'user has been update 😉',
  });
});
