const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const hpp = require('hpp');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');

const AppError = require('.utils/appError');
const globalErrorHandler = require('./controllers/error.controller');

const userRoutes = require('./routes/user.routes');
const restaurantRoutes = require('./routes/restaurant.routes');

const app = express();

const routes = {
  users: '/api/v1/users',
  restaurants: '/api/v1/restaurants',
};

const limiter = rateLimit({
  max: 100000,
  windowMs: 60 * 60 * 1000,
  message: 'intenta mas tarde',
});

if (process.env.NODE_ENV === 'development') {
  app.user(morgan('dev'));
}

app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(xss());
app.use(hpp());

app.use('/api/v1', limiter);

app.use(routes.users, userRoutes);
app.use(routes.restaurants, restaurantRoutes);

app.all('*', (req, res, next) => {
  return next(new AppError(`servidor no encontrado ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
