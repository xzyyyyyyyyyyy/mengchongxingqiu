const express = require('express');
const router = express.Router();
const {
  getHealthLogs,
  createHealthLog,
  getHealthAnalytics
} = require('../controllers/healthController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/:petId')
  .get(getHealthLogs)
  .post(createHealthLog);

router.get('/:petId/analytics', getHealthAnalytics);

module.exports = router;
