/* eslint-disable comma-dangle */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const geocoder = require('./../utils/geocoder');

const galleryModel = new mongoose.Schema(
  {
    title: String,
    description: String,
    image: String,
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isMainFeatured: {
      type: Boolean,
      default: false,
    },
    likes: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  {
    timestamps: true,
  }
);

// eslint-disable-next-line func-names
galleryModel.virtual('id').get(function () {
  // eslint-disable-next-line no-underscore-dangle
  return this._id.toHexString();
});

galleryModel.set('toJSON', { virtuals: true });

// geocode create location
// eslint-disable-next-line func-names
// galleryModel.pre('save', async function (next) {
//   const loc = await geocoder.geocode(this.address);
//   this.location = {
//     type: 'Point',
//     coordinates: [loc[0].longitude, loc[0].latitude],
//     formattedAddress: loc[0].formattedAddress,
//   };
//   this.address = undefined;
//   next();
// });

module.exports = galleryModel = mongoose.model('gallery', galleryModel);
