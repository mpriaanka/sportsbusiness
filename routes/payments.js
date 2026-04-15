const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, ctrl.makePayment);
router.get('/booking/:bookingId', authenticate, ctrl.getByBooking);

module.exports = router;
