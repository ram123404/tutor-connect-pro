
const express = require('express');
const {
  createRequest,
  getRequests,
  acceptRequest,
  rejectRequest,
  extendBooking,
} = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all routes
router.use(protect);

router.post('/', createRequest);
router.get('/', getRequests);
router.put('/:id/accept', acceptRequest);
router.put('/:id/reject', rejectRequest);
router.post('/extend', extendBooking);

module.exports = router;
