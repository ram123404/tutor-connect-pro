
const TuitionRequest = require('../models/TuitionRequest');
const Booking = require('../models/Booking');
const User = require('../models/User');

// Create a new tuition request
exports.createRequest = async (req, res) => {
  try {
    // Check if user is a student
    if (req.user.role !== 'student') {
      return res.status(403).json({
        status: 'fail',
        message: 'Only students can create tuition requests',
      });
    }
    
    const {
      tutorId,
      subject,
      gradeLevel,
      preferredDays,
      preferredTime,
      duration,
      startDate,
      monthlyFee,
      notes,
    } = req.body;
    
    // Check if tutor exists
    const tutor = await User.findById(tutorId);
    if (!tutor || tutor.role !== 'tutor') {
      return res.status(404).json({
        status: 'fail',
        message: 'No tutor found with that ID',
      });
    }
    
    // Create tuition request
    const newRequest = await TuitionRequest.create({
      student: req.user.id,
      tutor: tutorId,
      subject,
      gradeLevel,
      preferredDays,
      preferredTime,
      duration,
      startDate,
      monthlyFee,
      notes,
    });
    
    res.status(201).json({
      status: 'success',
      data: {
        request: newRequest,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Get all requests (filtered by role)
exports.getRequests = async (req, res) => {
  try {
    let query = {};
    
    // Filter by student or tutor
    if (req.user.role === 'student') {
      query.student = req.user.id;
    } else if (req.user.role === 'tutor') {
      query.tutor = req.user.id;
    }
    
    // Get requests with populated data
    const requests = await TuitionRequest.find(query)
      .populate('student', 'name email profilePic')
      .populate('tutor', 'name email profilePic')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      status: 'success',
      results: requests.length,
      data: {
        requests,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Accept tuition request (for tutors)
exports.acceptRequest = async (req, res) => {
  try {
    // Check if user is a tutor
    if (req.user.role !== 'tutor') {
      return res.status(403).json({
        status: 'fail',
        message: 'Only tutors can accept tuition requests',
      });
    }
    
    // Find request
    const request = await TuitionRequest.findById(req.params.id);
    
    // Check if request exists
    if (!request) {
      return res.status(404).json({
        status: 'fail',
        message: 'No request found with that ID',
      });
    }
    
    // Check if tutor is the one assigned to the request
    if (request.tutor.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'fail',
        message: 'You can only accept requests assigned to you',
      });
    }
    
    // Check if request is already processed
    if (request.status !== 'pending') {
      return res.status(400).json({
        status: 'fail',
        message: `This request has already been ${request.status}`,
      });
    }
    
    // Update request status
    request.status = 'accepted';
    await request.save();
    
    // Create booking
    const newBooking = await Booking.create({
      tuitionRequest: request._id,
      student: request.student,
      tutor: request.tutor,
      subject: request.subject,
      startDate: request.startDate,
      endDate: request.endDate,
      daysOfWeek: request.preferredDays,
      timeSlot: request.preferredTime,
      monthlyFee: request.monthlyFee,
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        request,
        booking: newBooking,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Reject tuition request (for tutors)
exports.rejectRequest = async (req, res) => {
  try {
    // Check if user is a tutor
    if (req.user.role !== 'tutor') {
      return res.status(403).json({
        status: 'fail',
        message: 'Only tutors can reject tuition requests',
      });
    }
    
    // Find request
    const request = await TuitionRequest.findById(req.params.id);
    
    // Check if request exists
    if (!request) {
      return res.status(404).json({
        status: 'fail',
        message: 'No request found with that ID',
      });
    }
    
    // Check if tutor is the one assigned to the request
    if (request.tutor.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'fail',
        message: 'You can only reject requests assigned to you',
      });
    }
    
    // Check if request is already processed
    if (request.status !== 'pending') {
      return res.status(400).json({
        status: 'fail',
        message: `This request has already been ${request.status}`,
      });
    }
    
    // Update request status
    request.status = 'rejected';
    await request.save();
    
    res.status(200).json({
      status: 'success',
      data: {
        request,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Extend booking (for students)
exports.extendBooking = async (req, res) => {
  try {
    // Check if user is a student
    if (req.user.role !== 'student') {
      return res.status(403).json({
        status: 'fail',
        message: 'Only students can extend bookings',
      });
    }
    
    const { bookingId, additionalMonths } = req.body;
    
    // Find booking
    const booking = await Booking.findById(bookingId);
    
    // Check if booking exists
    if (!booking) {
      return res.status(404).json({
        status: 'fail',
        message: 'No booking found with that ID',
      });
    }
    
    // Check if student owns the booking
    if (booking.student.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'fail',
        message: 'You can only extend your own bookings',
      });
    }
    
    // Check if booking is active
    if (booking.status !== 'active') {
      return res.status(400).json({
        status: 'fail',
        message: 'Only active bookings can be extended',
      });
    }
    
    // Store previous end date
    const previousEndDate = new Date(booking.endDate);
    
    // Calculate new end date
    const newEndDate = new Date(booking.endDate);
    newEndDate.setMonth(newEndDate.getMonth() + additionalMonths);
    
    // Update booking
    booking.extended = true;
    booking.endDate = newEndDate;
    booking.extensionHistory.push({
      previousEndDate,
      newEndDate,
      extendedOn: new Date(),
    });
    
    await booking.save();
    
    res.status(200).json({
      status: 'success',
      data: {
        booking,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};
