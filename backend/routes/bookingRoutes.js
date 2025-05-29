
const express = require('express');
const {
  getBookings,
  updateBookingStatus,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all routes
router.use(protect);

router.get('/', getBookings);
router.put('/:id/status', updateBookingStatus);

module.exports = router;
