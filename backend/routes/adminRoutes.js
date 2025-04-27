
const express = require('express');
const {
  getAllUsers,
  getAllRequests,
  toggleBlockUser,
} = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all routes and restrict to admin only
router.use(protect);
router.use(restrictTo('admin'));

router.get('/users', getAllUsers);
router.get('/requests', getAllRequests);
router.put('/users/:id/block', toggleBlockUser);

module.exports = router;
