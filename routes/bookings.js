const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/bookingController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/available-slots', ctrl.getAvailableSlots);
router.get('/stats', authenticate, authorize('manager', 'admin'), ctrl.getStats);
router.get('/', authenticate, ctrl.getAll);
router.get('/:id', authenticate, ctrl.getById);
router.post('/', authenticate, ctrl.create);
router.put('/:id/cancel', authenticate, ctrl.cancel);

module.exports = router;
