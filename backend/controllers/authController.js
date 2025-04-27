
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const TutorProfile = require('../models/TutorProfile');

// Helper function to generate JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phoneNumber, address } = req.body;
    
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email already in use',
      });
    }
    
    // Create new user
    const newUser = await User.create({
      name,
      email,
      password,
      role,
      phoneNumber,
      address,
    });
    
    // If role is tutor, create an empty tutor profile
    if (role === 'tutor') {
      await TutorProfile.create({
        user: newUser._id,
        subjects: [],
        experience: 0,
        availability: '',
        monthlyRate: 0,
      });
    }
    
    // Generate JWT token
    const token = signToken(newUser._id);
    
    // Remove password from output
    newUser.password = undefined;
    
    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password',
      });
    }
    
    // Find user by email and explicitly select the password
    const user = await User.findOne({ email }).select('+password');
    
    // Check if user exists and password is correct
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password',
      });
    }
    
    // Check if the role matches (if provided)
    if (role && user.role !== role) {
      return res.status(401).json({
        status: 'fail',
        message: `Invalid credentials for ${role} role`,
      });
    }
    
    // Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({
        status: 'fail',
        message: 'Your account has been blocked. Please contact admin.',
      });
    }
    
    // Generate token
    const token = signToken(user._id);
    
    // Remove password from output
    user.password = undefined;
    
    res.status(200).json({
      status: 'success',
      token,
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
