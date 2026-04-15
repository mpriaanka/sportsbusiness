const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/notificationController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, ctrl.getAll);
router.post('/', authenticate, authorize('manager', 'admin'), ctrl.send);
router.post('/bulk', authenticate, authorize('manager', 'admin'), ctrl.sendBulk);
router.put('/:id/read', authenticate, ctrl.markRead);
router.put('/read-all', authenticate, ctrl.markAllRead);

module.exports = router;
