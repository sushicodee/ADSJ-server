const UserModel = require('./../models/auth.model');
const bcrypt = require('bcryptjs');
const userMapper = (user, data) => {
  Object.keys(data).forEach((key) => {
    if (
      [
        'name',
        'email',
        'password',
        'phone',
        'apartment',
        'zip',
        'city',
        'country',
        'street',
        'emailNotifications',
        'postNotification',
        'username',
      ].includes(key)
    ) {
      user[key] = data[key];
    }
  });
};

const findAll = () => UserModel.find().select('-password');

const findById = (id) => UserModel.findById(id).select('-password');

const findOne = (email) => UserModel.findOne({ email }).select('-password');

const getCount = async (_, res, next) => {
  try {
    const userCount = await UserModel.countDocuments((count) => count);
    res.status(200).json({ userCount });
  } catch (err) {
    next({ err, status: 500 });
  }
};

const remove = (id, res, next) => {
  UserModel.findById(id, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next({ message: 'user not found' });
    }
    user.remove((err, data) => {
      if (err) {
        return next(err);
      }
      res
        .status(200)
        .json({ data, message: 'the user is removed', success: true });
    });
  });
};

const block = (id, res, next) => {
  UserModel.findById(id, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next({ message: 'user not found' });
    }
    const updatedData = {
      blocked: !user.blocked,
    };
    userMapper(updatedData, data);
    return UserModel.findByIdAndUpdate(id, updatedData, { new: true });
  });
};
module.exports = {
  findById,
  findAll,
  getCount,
  remove,
  findOne,
  block,
};
