const router = require('express').Router();
const AuthController = require('./../../controllers/auth.controller');
// const passport = require('passport');

router
  .post('/activation', AuthController.activation)
  .post('/signup', AuthController.register)
  .post('/login', AuthController.login)
  .post('/googlelogin', AuthController.googleLogin)
  .post('/facebookLogin', AuthController.facebookLogin)
  .post('/password/passwordForgot', AuthController.forgotPassword)
  .post('/password/reset', AuthController.resetPassword)
  .post('/renew', AuthController.renewToken);

module.exports = router;
