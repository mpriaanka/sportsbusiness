const { Payment, Booking } = require('../models');
const { Op } = require('sequelize');

exports.makePayment = async (req, res) => {
  try {
    const { booking_id, amount_paid, payment_type } = req.body;
    if (!booking_id || !amount_paid) {
      return res.status(400).json({ error: 'booking_id and amount_paid are required' });
    }

    const booking = await Booking.findByPk(booking_id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    // Create payment record (simulated - always succeeds)
    const payment = await Payment.create({
      booking_id,
      amount_paid,
      payment_type: payment_type || 'Advance',
      payment_status: 'Success',
      payment_date: new Date()
    });

    // Check if total paid >= 50% of total_amount → confirm booking
    const allPayments = await Payment.findAll({
      where: { booking_id, payment_status: 'Success' }
    });
    const totalPaid = allPayments.reduce((sum, p) => sum + parseFloat(p.amount_paid), 0);
    const threshold = parseFloat(booking.total_amount) * 0.5;

    if (totalPaid >= threshold && booking.status === 'Pending') {
      await booking.update({ status: 'Confirmed' });
    }

    // Check if fully paid
    if (totalPaid >= parseFloat(booking.total_amount)) {
      await payment.update({ payment_type: 'Full' });
    }

    const updatedBooking = await Booking.findByPk(booking_id, {
      include: [{ model: Payment }]
    });

    res.status(201).json({
      message: 'Payment successful',
      payment,
      booking: updatedBooking,
      totalPaid,
      remainingAmount: Math.max(0, parseFloat(booking.total_amount) - totalPaid)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByBooking = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      where: { booking_id: req.params.bookingId },
      order: [['payment_date', 'DESC']]
    });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
