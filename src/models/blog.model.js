/* eslint-disable comma-dangle */
const mongoose = require('mongoose');

const geocoder = require('./../utils/geocoder');

const requriedString = {
  type: String,
  required: true,
};

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
  },
  coordinates: {
    type: [Number],
    index: '2dsphere',
  },
  formattedAddress: String,
});

const blogModel = new mongoose.Schema(
  {
    title: requriedString,
    description: String,
    image: String,
    images: [{ type: String }],
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    location: {
      type: pointSchema,
    },
    address: {
      type: String,
      required: [true, 'Please Enter an Address'],
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    // category: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'category',
    //   required: true,
    // },
    endDate: {
      type: Date,
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
);

// eslint-disable-next-line func-names
blogModel.virtual('id').get(function () {
  // eslint-disable-next-line no-underscore-dangle
  return this._id.toHexString();
});

blogModel.set('toJSON', { virtuals: true });

// geocode create location
// eslint-disable-next-line func-names
blogModel.pre('save', async function (next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
  };
  this.address = undefined;
  next();
});

module.exports = BlogModel = mongoose.model('blog', blogModel);
