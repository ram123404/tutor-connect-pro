
const Booking = require('../models/Booking');
const TuitionRequest = require('../models/TuitionRequest');

// Get bookings for current user
exports.getBookings = async (req, res) => {
  try {
    let query = {};
    
    // Filter by student or tutor
    if (req.user.role === 'student') {
      query.student = req.user.id;
    } else if (req.user.role === 'tutor') {
      query.tutor = req.user.id;
    }
    
    // Get bookings with populated data
    const bookings = await Booking.find(query)
      .populate('student', 'name email profilePic')
      .populate('tutor', 'name email profilePic')
      .populate('tuitionRequest')
      .sort({ createdAt: -1 });
    
    // Update status based on end date
    const now = new Date();
    for (let booking of bookings) {
      if (booking.status === 'active' && new Date(booking.endDate) < now) {
        booking.status = 'completed';
        await booking.save();
      }
    }
    
    res.status(200).json({
      status: 'success',
      results: bookings.length,
      data: {
        bookings,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        status: 'fail',
        message: 'No booking found with that ID',
      });
    }
    
    // Check if user has permission to update
    if (req.user.role === 'student' && booking.student.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'fail',
        message: 'You can only update your own bookings',
      });
    }
    
    if (req.user.role === 'tutor' && booking.tutor.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'fail',
        message: 'You can only update your own bookings',
      });
    }
    
    booking.status = status;
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
