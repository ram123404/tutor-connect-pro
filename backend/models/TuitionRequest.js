
const mongoose = require('mongoose');

const tuitionRequestSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
    },
    gradeLevel: {
      type: String,
      required: [true, 'Grade/class level is required'],
    },
    preferredDays: {
      type: [String],
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: [true, 'Preferred days are required'],
    },
    preferredTime: {
      type: String,
      required: [true, 'Preferred time is required'],
    },
    duration: {
      type: Number, // in months
      default: 1,
      min: 1,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    monthlyFee: {
      type: Number,
      required: [true, 'Monthly fee is required'],
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to calculate end date
tuitionRequestSchema.pre('save', function (next) {
  if (this.isModified('startDate') || this.isModified('duration')) {
    const endDate = new Date(this.startDate);
    endDate.setMonth(endDate.getMonth() + this.duration);
    this.endDate = endDate;
  }
  next();
});

const TuitionRequest = mongoose.model('TuitionRequest', tuitionRequestSchema);
module.exports = TuitionRequest;
