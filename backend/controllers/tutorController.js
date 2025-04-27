
const User = require('../models/User');
const TutorProfile = require('../models/TutorProfile');

// Get all tutors with filtering options
exports.getAllTutors = async (req, res) => {
  try {
    const { subject, location, experience } = req.query;
    
    // Find all active users with role 'tutor' and not blocked
    const query = {
      role: 'tutor',
      isActive: true,
      isBlocked: false,
    };
    
    // Find tutors with matching criteria
    const tutors = await User.find(query)
      .populate('tutorProfile')
      .select('-__v');
    
    // Filter by subject
    let filteredTutors = tutors;
    if (subject) {
      filteredTutors = filteredTutors.filter(
        tutor => tutor.tutorProfile?.subjects.some(s => 
          s.toLowerCase().includes(subject.toLowerCase())
        )
      );
    }
    
    // Filter by location (city or area)
    if (location) {
      filteredTutors = filteredTutors.filter(tutor => 
        tutor.address?.city?.toLowerCase()?.includes(location.toLowerCase()) ||
        tutor.address?.area?.toLowerCase()?.includes(location.toLowerCase())
      );
    }
    
    // Filter by minimum years of experience
    if (experience) {
      filteredTutors = filteredTutors.filter(
        tutor => tutor.tutorProfile?.experience >= parseInt(experience)
      );
    }
    
    res.status(200).json({
      status: 'success',
      results: filteredTutors.length,
      data: {
        tutors: filteredTutors,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Get single tutor
exports.getTutor = async (req, res) => {
  try {
    const tutor = await User.findById(req.params.id).populate('tutorProfile');
    
    if (!tutor || tutor.role !== 'tutor') {
      return res.status(404).json({
        status: 'fail',
        message: 'No tutor found with that ID',
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        tutor,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Update tutor profile
exports.updateTutorProfile = async (req, res) => {
  try {
    // Check if user is a tutor
    if (req.user.role !== 'tutor') {
      return res.status(403).json({
        status: 'fail',
        message: 'Only tutors can update tutor profiles',
      });
    }
    
    const { subjects, experience, availability, monthlyRate, education, about } = req.body;
    
    // Update tutor profile
    const updatedProfile = await TutorProfile.findOneAndUpdate(
      { user: req.user.id },
      {
        ...(subjects && { subjects }),
        ...(experience && { experience }),
        ...(availability && { availability }),
        ...(monthlyRate && { monthlyRate }),
        ...(education && { education }),
        ...(about && { about }),
      },
      {
        new: true,
        runValidators: true,
      }
    );
    
    if (!updatedProfile) {
      return res.status(404).json({
        status: 'fail',
        message: 'No tutor profile found for this user',
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        tutorProfile: updatedProfile,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};
