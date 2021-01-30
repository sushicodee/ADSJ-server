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

// router.post('logout', (req, res) => {
//   res.send('logout');
// });

// router.get(
//   '/google',
//   passport.authenticate('google', {
//     scope: ['profile', 'email'],
//   })
// );

// router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
//   res.redirect('/profile');
// });

// router.get(
//   '/facebook',
//   passport.authenticate('facebook', {
//     scope: ['profile', 'email'],
//   })
// );

// router.get(
//   '/google/redirect',
//   passport.authenticate('facebook'),
//   (req, res) => {
//     res.redirect('/profile');
//   }
// );

module.exports = router;
