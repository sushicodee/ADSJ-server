const Router = require('express').Router();

Router.use('/blog', require('./blog/blog.routes'));

module.exports = Router;
