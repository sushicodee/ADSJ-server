const morgan = require('morgan');

require('dotenv/config');

const helmet = require('helmet');

const express = require('express');

const cors = require('cors');

const { PORT, API, BASE_URL } = require('./configs/index');
const apiRoutes = require('./routes/api.routes');

const errorHandlingMiddleware = require('./middlewares/errorHandling');

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);

require('./configs/dbconfigs');

app.use(morgan('common'));
app.use(helmet());

app.get('/', (req, res) => res.json({ message: 'hello' }));
app.use(API, apiRoutes);

app.use(errorHandlingMiddleware.notFound);
app.use(errorHandlingMiddleware.errorHandler);

app.listen(PORT, () => {
  console.log(`server listening at port ${PORT}`);
});
