/* eslint-disable indent */
/* eslint-disable no-nested-ternary */
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../models/auth.model');
const EmailQuery = require('./../query/email.query');
const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');
const {
  JWT_SECRET,
  JWT_SECRET_REFRESH,
  JWT_SECRET_ACTIVATION,
  JWT_SECRET_RESET,
  GOOGLE_OAUTH_ID,
} = require('../configs');

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
      : type === 'passwordReset'
      ? JWT_SECRET_RESET
      : ' ';
  const expiresIn =
    type === 'access' ? '1hr' : type === 'refresh' ? '7d' : '30min';
  return `Bearer ${JWT.sign({ ...user }, SECRET, { expiresIn })}`;
}

const register = async (req, res, next) => {
  const { errors, valid } = validateRegisterInput(req.body);
  if (valid) {
    try {
      // eslint-disable-next-line prefer-const
      let { username, email, password } = req.body;
      password = await bcrypt.hash(password, 12);
      const user = await UserModel.findOne({ username }).select('username');
      if (user) {
        return next({ message: 'username is taken' });
      }
      const userEmail = await UserModel.findOne({ email }).select('email');
      if (userEmail) {
        return next({ message: 'email is already registered' });
      }
      if (username.endsWith('.com')) {
        return next({ message: 'username cannot end with .com' });
      }
      const token = generateToken(
        { username, email, password },
        'activation'
      ).split('Bearer ')[1];
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: `${process.env.APP_NAME} Account activation link,${username}`,
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
            message: `Registration Successfull Email has been sent to ${email}`,
          });
        }
      } catch (err) {
        return next({
          message: 'Something went wrong Please check email for Verification',
        });
      }
    } catch (err) {
      return next({ message: 'something went wrong' });
    }
  } else {
    return next({ errors, valid });
  }
};

const activation = async (req, res, next) => {
  const { token } = req.body;
  if (token) {
    JWT.verify(
      token,
      process.env.JWT_SECRET_ACTIVATION,
      async (err, decoded) => {
        if (err) {
          res.status(401);
          return next({ message: 'Expired link. Signup again' });
        }
        const { username, email, password } = JWT.decode(token);
        const newUser = new UserModel({
          username,
          email,
          password,
        });
        newUser.save((error, user) => {
          if (error) {
            return next({ message: 'Activation Error Please Try Again' });
          }
          return res.status(200).json({
            success: true,
            user,
            message: 'Account Activation successfull',
          });
        });
      }
    );
  } else {
    return next({
      message: 'Please Provide a valid Token',
    });
  }
};
const login = (req, res, next) => {
  const { username, password } = req.body;
  const { errors, valid } = validateLoginInput(username, password);
  if (valid) {
    const data = {};
    username.endsWith('.com')
      ? (data.email = username)
      : (data.username = username);
    UserModel.findOne(data).exec(async (err, user) => {
      if (err || !user) {
        res.status(400);
        return next({
          message: 'User with that email does not exist. Please signup',
        });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        res.status(400);
        return next({
          message: 'Username/email or password do not match',
        });
      }
      const { id, name, email, role } = user;
      const accessToken = generateToken(
        {
          id,
          email,
          role,
        },
        'access'
      );

      const refreshToken = generateToken(
        {
          id,
          email,
          role,
        },
        'refresh'
      );

      return res.status(200).json({
        accessToken,
        refreshToken,
        user: {
          id,
          name,
          email,
          role,
        },
        message: `${username} signed in successfully`,
      });
    });
  } else {
    res.status(422);
    return next({ errors, valid });
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    // eslint-disable-next-line prefer-const
    const { email } = req.body;
    const userEmail = await UserModel.findOne({ email }).select(
      'email id role'
    );
    if (!userEmail) {
      return next({ message: 'email is not registered, Please Sign up' });
    }
    const { id, role } = userEmail;
    const token = generateToken({ id, email, role }, 'passwordReset').split(
      'Bearer '
    )[1];
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: `${process.env.APP_NAME} Account password reset link`,
      generateTextFromHTML: true,
      html: `<h1>Please Click on the link to Reset your password </h1>
                      <p>${process.env.CORS_ORIGIN}/users/forgotPassword/${token}</p>
                      <hr/>
                      <p>This email contains sensetive information</p>
                      <p>${process.env.CORS_ORIGIN}</p>
                      `,
    };
    try {
      const emailResponse = await EmailQuery.sendEmail(mailOptions);
      if (emailResponse) {
        res.status(200).json({
          message: `Reset passwword link has been sent to ${email}`,
        });
      }
    } catch (err) {
      return next({
        message: 'Something went wrong Please check email for Verification',
      });
    }
  } catch (err) {
    return next({ message: 'something went wrong' });
  }
};

const resetPassword = async (req, res, next) => {
  let { token, password } = req.body;
  if (password === '') return next({ message: 'Password cannot be empty' });
  if (!token) return next({ message: 'token not provided' });
  JWT.verify(token, JWT_SECRET_RESET, async (err, decoded) => {
    if (err) {
      res.status(401);
      return next({
        message: 'Expired link. Please send a reset link again',
      });
    }
    const { id } = JWT.decode(token);
    password = await bcrypt.hash(password, 12);
    const updatedData = {
      password,
    };
    UserModel.findByIdAndUpdate(id, updatedData, { new: true })
      .then((user) => {
        return res.status(200).json({
          success: true,
          user,
          message: 'Account password reset successfull',
        });
      })
      .catch((err) => {
        return next({ message: 'Reset password Error Please Try Again' });
      });
  });
};

const client = new OAuth2Client(GOOGLE_OAUTH_ID);
const googleLogin = (req, res, next) => {
  const { idToken } = req.body;
  client
    .verifyIdToken({ idToken, audience: GOOGLE_OAUTH_ID })
    .then(async (response) => {
      const { email_verified, name, picture, email } = response.payload;
      if (email_verified) {
        try {
          const user = await UserModel.findOne({ email });
          const { id, role, name, username } = user;
          const accessToken = generateToken(
            {
              id,
              email,
              role,
            },
            'access'
          );
          const refreshToken = generateToken(
            {
              id,
              email,
              role,
            },
            'refresh'
          );
          return res.status(200).json({
            accessToken,
            refreshToken,
            user: {
              id,
              name,
              username,
              email,
              role,
            },
            message: `${username || name} signed in successfully`,
          });
        } catch (err) {
          // user dosent exist
          let password = email + process.env.PASSWORD_SECRET;
          password = await bcrypt.hash(password, 12);
          const newUser = new UserModel({
            email,
            password,
            image: picture,
            name,
          });
          newUser.save((error, user) => {
            if (error) {
              return next({ message: 'error creating user profile' });
            }
            const { id, role, username } = user;
            const accessToken = generateToken(
              {
                id,
                email,
                role,
              },
              'access'
            );
            const refreshToken = generateToken(
              {
                id,
                email,
                role,
              },
              'refresh'
            );
            return res.status(200).json({
              accessToken,
              refreshToken,
              user: {
                id,
                name,
                username: username || undefined,
                email,
                role,
              },
              message: `${name} signed in successfully`,
            });
          });
        }
      }
      return next({ message: 'Google login failed, Please try again' });
    })
    .catch((err) => {
      next({ message: 'invalid token' });
    });
};

const facebookLogin = (req, res, next) => {
  const { userID, accessTokens } = req.body;
  const url = `https://graph.facebook.com/v2.11/${userID}?fields=id,name,email,picture&access_token=${accessTokens}`;
  return fetch(url, { method: 'GET' })
    .then((response) => response.json())
    .then(async (response) => {
      const { name, email, picture } = response;
      try {
        const user = await UserModel.findOne({ email })
          .select('-password')
          .exec();
        const { id, role, username } = user;
        const accessToken = generateToken(
          {
            id,
            email,
            role,
          },
          'access'
        );
        const refreshToken = generateToken(
          {
            id,
            email,
            role,
          },
          'refresh'
        );
        return res.status(200).json({
          accessToken,
          refreshToken,
          user: {
            id,
            name,
            username,
            email,
            role,
          },
          message: `${username || name} signed in successfully`,
        });
      } catch (err) {
        // user dosent exist
        let password = email + process.env.PASSWORD_SECRET;
        password = await bcrypt.hash(password, 12);
        const newUser = new UserModel({
          email,
          password,
          image: picture.url,
          name,
        });
        newUser.save((error, user) => {
          if (error) {
            return next({ message: 'error creating user profile' });
          }
          const { id, role, username } = user;
          const accessToken = generateToken(
            {
              id,
              email,
              role,
            },
            'access'
          );
          const refreshToken = generateToken(
            {
              id,
              email,
              role,
            },
            'refresh'
          );
          return res.status(200).json({
            accessToken,
            refreshToken,
            user: {
              id,
              name,
              username: username || undefined,
              email,
              role,
            },
            message: `${name} signed in successfully`,
          });
        });
      }
    })
    .catch((err) => {
      next({ message: 'invalid token' });
    });
};

const renewToken = async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return next({ message: 'no refresh token or BlackListed token Provided' });
  }
  try {
    const user = await JWT.verify(
      refreshToken.split('Bearer ')[1],
      JWT_SECRET_REFRESH
    );
    if (user) {
      const accessToken = generateToken(user, 'access');
      const refreshToken = generateToken(user, 'refresh');
      return res.status(200).json({
        accessToken,
        refreshToken,
      });
    }
  } catch (err) {
    return next({ message: 'invalid token' });
  }
};

module.exports = {
  register,
  activation,
  login,
  forgotPassword,
  resetPassword,
  googleLogin,
  facebookLogin,
  renewToken,
};
