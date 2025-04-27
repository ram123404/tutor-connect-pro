
const express = require('express');
const { getAllTutors, getTutor, updateTutorProfile } = require('../controllers/tutorController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getAllTutors);
router.get('/:id', getTutor);

// Protected routes
router.use(protect);
router.put('/:id', restrictTo('tutor'), updateTutorProfile);

module.exports = router;
