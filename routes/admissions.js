const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/admissionController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, ctrl.getAll);
router.post('/', authenticate, ctrl.create);
router.put('/:id/cancel', authenticate, ctrl.cancel);

module.exports = router;
