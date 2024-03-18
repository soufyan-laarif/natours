const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// MIDDLEWARES

app.use(express.json()); // express.json() -> Middleware
// morgan : 3rd-party middleware --> HTTP request logger middleware
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Serving static files from public folder
app.use(express.static(`${__dirname}/public`));

// Custom middleware
app.use((req, res, next) => {
  console.log('Hello from the middleware 😊');
  next();
});

// Custom middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Mounting
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
