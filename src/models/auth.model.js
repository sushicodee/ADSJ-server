const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    image: String,
    timelineImage: String,
    name: {
      type: String,
      trim: true,
      min: 1,
      max: 50,
    },
    username: {
      type: String,
      unique: true,
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
    emailNotifications: {
      type: Boolean,
      default: false,
    },
    postNotifications: {
      type: Boolean,
      default: false,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    dob: Date || null,
    gender: {
      type: String,
      enum: ['male', 'female', 'others', ''],
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    description: String,
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
