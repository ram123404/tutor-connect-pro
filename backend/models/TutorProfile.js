
const mongoose = require('mongoose');

const tutorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    subjects: {
      type: [String],
      required: [true, 'Please specify the subjects you teach'],
    },
    experience: {
      type: Number, // in years
      required: [true, 'Please specify your years of experience'],
    },
    availability: {
      type: String,
      required: [true, 'Please specify your availability'],
    },
    monthlyRate: {
      type: Number,
      required: [true, 'Please specify your expected monthly fee'],
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    education: {
      type: [String],
    },
    about: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const TutorProfile = mongoose.model('TutorProfile', tutorProfileSchema);
module.exports = TutorProfile;
