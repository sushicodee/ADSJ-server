const Router = require('express').Router();

Router.use('/auth', require('./auth/auth.routes'));
Router.use('/blog', require('./blog/blog.routes'));
Router.use('/payment', require('./stripe/stripe.routes'));

module.exports = Router;
