const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/equipmentController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', ctrl.getAll);
router.post('/', authenticate, authorize('admin'), ctrl.create);
router.put('/:id', authenticate, authorize('admin'), ctrl.update);
router.delete('/:id', authenticate, authorize('admin'), ctrl.remove);

module.exports = router;
