const mongoose = require('mongoose');

let connectionUrl = 'mongodb://127.0.0.1:27017';
let dbName = process.env.MONGO_DATABASE;

if (process.env.NODE_ENV === 'development') {
  dbName = 'travel-app-database-development';
  connectionUrl = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.fdomo.mongodb.net/${dbName}?retryWrites=true&w=majority`;
}
if (process.env.NODE_ENV === 'production') {
  connectionUrl = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.fdomo.mongodb.net/${dbName}?retryWrites=true&w=majority`;
}
const DB_CONFIG = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

mongoose
  .connect(connectionUrl, DB_CONFIG)
  .then(() => {
    console.log('Connected to Mongodb');
  })
  .catch((err) => {
    console.log(err);
  });
