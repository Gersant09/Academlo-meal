const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review.model');
const AppError = require('../utils/appError');

exports.existReview = catchAsync(async (req, res, next) => {
  /* valor a retornar */

  const { id } = req.params;
  const review = await Review.findOne({
    where: {
      status: true,
      id,
    },
    include: [
      {
        model: User,
      },
    ],
  });

  if (!review) return next(new AppError(`Review with id:${id} not found`, 404));

  req.review = review;
  req.user = review.user;

  next();
});
