const mongoose = require('mongoose');
const djSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    djDescription: {
      type: String,
      required: true,
    },
    alias: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'Oczekuje',
    },
    musicGenres: {
      type: [String],
    },
    offers: {
      type: [String],
    },
    profileImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const djModel = mongoose.model('djs', djSchema);
module.exports = djModel;
