
const User = require('../models/User');
const TuitionRequest = require('../models/TuitionRequest');

// Get all users (for admin)
exports.getAllUsers = async (req, res) => {
  try {
    // Find all users
    const users = await User.find().select('-__v');
    
    // Group users by role
    const tutors = users.filter(user => user.role === 'tutor');
    const students = users.filter(user => user.role === 'student');
    const admins = users.filter(user => user.role === 'admin');
    
    res.status(200).json({
      status: 'success',
      data: {
        users,
        counts: {
          total: users.length,
          tutors: tutors.length,
          students: students.length,
          admins: admins.length,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Get all tuition requests (for admin)
exports.getAllRequests = async (req, res) => {
  try {
    // Find all requests with populated data
    const requests = await TuitionRequest.find()
      .populate('student', 'name email profilePic')
      .populate('tutor', 'name email profilePic')
      .sort({ createdAt: -1 });
    
    // Count requests by status
    const pendingCount = requests.filter(req => req.status === 'pending').length;
    const acceptedCount = requests.filter(req => req.status === 'accepted').length;
    const rejectedCount = requests.filter(req => req.status === 'rejected').length;
    
    res.status(200).json({
      status: 'success',
      results: requests.length,
      data: {
        requests,
        counts: {
          total: requests.length,
          pending: pendingCount,
          accepted: acceptedCount,
          rejected: rejectedCount,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Block/unblock user
exports.toggleBlockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'No user found with that ID',
      });
    }
    
    // Toggle isBlocked status
    user.isBlocked = !user.isBlocked;
    await user.save();
    
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};
