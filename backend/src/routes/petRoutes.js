const express = require('express');
const router = express.Router();
const {
  getPets,
  getPet,
  createPet,
  updatePet,
  deletePet,
  addHealthRecord,
  addReminder
} = require('../controllers/petController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getPets)
  .post(createPet);

router.route('/:id')
  .get(getPet)
  .put(updatePet)
  .delete(deletePet);

router.post('/:id/health', addHealthRecord);
router.post('/:id/reminders', addReminder);

module.exports = router;
