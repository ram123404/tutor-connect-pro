
const User = require('../models/User');
const TutorProfile = require('../models/TutorProfile');

// Get current user profile
exports.getMe = async (req, res) => {
  try {
    let userData = req.user;
    
    // If the user is a tutor, include tutor profile
    if (req.user.role === 'tutor') {
      userData = await User.findById(req.user._id).populate('tutorProfile');
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        user: userData,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Update user profile
exports.updateMe = async (req, res) => {
  try {
    const { name, phoneNumber, address, profilePic } = req.body;
    
    // Filter out unwanted fields that are not allowed to be updated
    const filteredBody = {
      ...(name && { name }),
      ...(phoneNumber && { phoneNumber }),
      ...(address && { address }),
      ...(profilePic && { profilePic }),
    };
    
    // Update user
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true,
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};
