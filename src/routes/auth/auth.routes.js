const router = require('express').Router();
const AuthController = require('./../../controllers/auth.controller');
// const passport = require('passport');

router.post('/signup', AuthController.register);

// router.post('/login', async (res, req) => {
//   const { errors, valid } = validateLoginInput(username, password);
//   if (!valid) {
//     res.status(400).send({ msg: errors });
//   }
//   const user = await userModel.findOne({ username });
//   if (!user) {
//     errors.general = "Username dosen't exist";
//     res.status(400).send({ msg: errors });
//   } else {
//     const match = await bcrypt.compare(password, user.password);
//     errors.general = 'Wrong Password';
//     if (!match) {
//       res.status(400).send({ msg: errors });
//     }
//     res.status(200).send({
//       ...user._doc,
//       id: user._id,
//     });
//   }
// });

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
