const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    googleId: {
      type: String,
      unique: true,
      // required: true,
    },
    image: String,
    timelineImage: String,
    username: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      min: 6,
      max: 25,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      sparse: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    role: {
      type: String,
      default: 'user',
    },
    resetPasswordLink: {
      data: String,
      default: '',
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// eslint-disable-next-line func-names
userSchema.virtual('id').get(function () {
  // eslint-disable-next-line no-underscore-dangle
  return this._id.toHexString();
});

userSchema.set('toJSON', { virtuals: true });

module.exports = UserModel = mongoose.model('user', userSchema);
