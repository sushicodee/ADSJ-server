const morgan = require('morgan');

require('dotenv/config');

const helmet = require('helmet');

const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');
const authJwt = require('./src/middlewares/authJwt');
const adminJwt = require('./src/middlewares/adminJwt');
const { PORT, API } = require('./src/configs/index');
const apiRoutes = require('./src/routes/api.routes');

const errorHandlingMiddleware = require('./src/middlewares/errorHandling');
const { limiter, speedLimiter } = require('./src/middlewares/rateLimit');

const app = express();
// parse x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// parse json
// app.use(express.json());
app.use(bodyParser.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);

require('./src/configs/dbconfigs');

app.set('trust proxy', 1);
app.use(morgan('common'));
app.use(helmet());
app.use(authJwt());
app.use(adminJwt());

// routes
app.use(API, limiter, speedLimiter, apiRoutes);
// error handling middleware
app.use(errorHandlingMiddleware.notFound);
app.use(errorHandlingMiddleware.errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`server listening at port ${PORT}`);
});
