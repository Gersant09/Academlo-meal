const Restaurant = require('../models/restaurant.model');
const catchAsync = require('../utils/catchAsync');

exports.findAll = catchAsync(async (req, res, next) => {
  const restaurants = await Restaurant.findAll({
    where: {
      status: true,
    },
  });
  return res.status(200).json({
    status: 'success',
    message: 'restaurants find',
    restaurants,
    results: restaurants.length,
  });
});

exports.create = catchAsync(async (req, res, next) => {
  const { name, address, rating } = req.body;

  await Restaurant.create({ name, address, rating });

  return res.status(201).json({
    status: 'success',
  });
});

exports.findOne = catchAsync(async (req, res, next) => {
  const { restaurant } = req;

  return res.status(200).json({
    status: 'success',
    restaurant,
  });
});

exports.update = catchAsync(async (req, res, next) => {
  const { restaurant } = req;
  const { name, address } = req;

  await restaurant.update({ name, address });
  return res.status(200).json({
    status: 'success',
  });
});

exports.delete = catchAsync(async (req, res, next) => {
  const { restaurant } = req;

  await restaurant.update({ status: false });
  return res.status(200).json({
    status: 'success',
  });
});
