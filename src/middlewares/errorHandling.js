const notFound = (req, res, next) => {
  const error = new Error(`${req.originalUrl}-Not Found`);
  res.status(404);
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? 'oh no' : err.stack,
  });
};

module.exports = { notFound, errorHandler };
