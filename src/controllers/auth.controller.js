const bcrypt = require('bcrypt');
const UserModel = require('../models/auth.model');
const EmailQuery = require('./../query/email.query');
const {
  JWT_SECRET,
  JWT_SECRET_REFRESH,
  JWT_SECRET_ACTIVATION,
} = require('./../configs');
const JWT = require('jsonwebtoken');

const {
  validateLoginInput,
  validateRegisterInput,
} = require('../utils/validators/userValidator');

function generateToken(user, type = '') {
  const SECRET =
    type === 'access'
      ? JWT_SECRET
      : type === 'refresh'
      ? JWT_SECRET_REFRESH
      : type === 'activation'
      ? JWT_SECRET_ACTIVATION
      : ' ';
  const expiresIn =
    type === 'access' ? '1hr' : type === 'refresh' ? '7d' : '30min';
  return (
    'Bearer' +
    ' ' +
    JWT.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      SECRET,
      { expiresIn }
    )
  );
}

const register = async (req, res, next) => {
  const { errors, valid } = validateRegisterInput(req.body);
  if (valid) {
    try {
      // eslint-disable-next-line prefer-const
      let { username, email, password } = req.body;
      const user = await UserModel.findOne({ username }).select('username');
      if (user) {
        return next({ message: 'username is taken' });
      }
      const userEmail = await UserModel.findOne({ email }).select('email');
      if (userEmail) {
        return next({ message: 'email is already registered' });
      }
      password = await bcrypt.hash(password, 12);
      const newUser = new UserModel({
        email,
        username,
        password,
      });
      try {
        const response = await newUser.save();
        if (response) {
          const { id, role } = response;
          const token = generateToken({ id, email, role }, 'activation').split(
            'Bearer '
          )[1];
          const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: response.email,
            subject: `${process.env.APP_NAME} Account activation link,${response.username}`,
            generateTextFromHTML: true,
            html: `<h1>Please Click on the link to activate</h1>
                    <p>${process.env.CORS_ORIGIN}/users/activate/${token}</p>
                    <hr/>
                    <p>This email contains sensetive information</p>
                    <p>${process.env.CORS_ORIGIN}</p>
                    `,
          };
          try {
            const emailResponse = await EmailQuery.sendEmail(mailOptions);
            if (emailResponse) {
              res.status(200).json({
                message: `Registration Successfull Email has been sent to ${response.email}`,
              });
            }
          } catch (err) {
            return next({
              message:
                'Something went wrong Please check email for Verification',
            });
          }
        }
      } catch (userErrors) {
        return next({ message: 'something went wrong' });
      }
    } catch (err) {
      return next({ message: 'something went wrong' });
    }
  } else {
    return next({ errors, valid });
  }
};

module.exports = { register };
