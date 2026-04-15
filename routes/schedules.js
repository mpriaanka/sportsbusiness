const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/scheduleController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', ctrl.getAll);
router.post('/', authenticate, authorize('manager', 'admin'), ctrl.create);
router.put('/:id', authenticate, authorize('manager', 'admin'), ctrl.update);
router.delete('/:id', authenticate, authorize('manager', 'admin'), ctrl.remove);

module.exports = router;
