const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/statsController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin'), getStats);

module.exports = router;
