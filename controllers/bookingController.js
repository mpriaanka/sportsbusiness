const { Booking, Court, Sport, Payment, Equipment, BookingEquipment, User, Schedule } = require('../models');
const { Op } = require('sequelize');

exports.getAvailableSlots = async (req, res) => {
  try {
    const { court_id, date } = req.query;
    if (!court_id || !date) {
      return res.status(400).json({ error: 'court_id and date are required' });
    }

    // Get the day of week from the date
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = dayNames[new Date(date).getDay()];

    // Get schedules for this court/day
    const schedules = await Schedule.findAll({
      where: { court_id, day_of_week: dayOfWeek, is_active: true }
    });

    // Generate time slots from schedules
    const allSlots = [];
    schedules.forEach(s => {
      let startHour = parseInt(s.start_time.split(':')[0]);
      const endHour = parseInt(s.end_time.split(':')[0]);
      while (startHour < endHour) {
        const slot = `${String(startHour).padStart(2, '0')}:00-${String(startHour + 1).padStart(2, '0')}:00`;
        allSlots.push(slot);
        startHour++;
      }
    });

    // If no schedules, generate default 8am-8pm slots
    if (allSlots.length === 0) {
      for (let h = 8; h < 20; h++) {
        allSlots.push(`${String(h).padStart(2, '0')}:00-${String(h + 1).padStart(2, '0')}:00`);
      }
    }

    // Find booked slots
    const bookedBookings = await Booking.findAll({
      where: {
        court_id, date,
        status: { [Op.in]: ['Pending', 'Confirmed'] }
      },
      attributes: ['time_slot']
    });
    const bookedSlots = bookedBookings.map(b => b.time_slot);

    const slots = allSlots.map(slot => ({
      time: slot,
      available: !bookedSlots.includes(slot)
    }));

    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { court_id, date, time_slot, equipment_ids, schedule_id } = req.body;
    if (!court_id || !date || !time_slot) {
      return res.status(400).json({ error: 'court_id, date, and time_slot are required' });
    }

    // Double-booking prevention
    const existingBooking = await Booking.findOne({
      where: {
        court_id, date, time_slot,
        status: { [Op.in]: ['Pending', 'Confirmed'] }
      }
    });
    if (existingBooking) {
      return res.status(409).json({ error: 'This slot is already booked' });
    }

    // Calculate total amount
    const court = await Court.findByPk(court_id);
    if (!court) return res.status(404).json({ error: 'Court not found' });

    let totalAmount = parseFloat(court.price_per_hour);

    // Add equipment costs
    if (equipment_ids && equipment_ids.length > 0) {
      const equipments = await Equipment.findAll({ where: { id: equipment_ids } });
      equipments.forEach(eq => { totalAmount += parseFloat(eq.price); });
    }

    const booking = await Booking.create({
      client_id: req.user.id,
      court_id, date, time_slot,
      total_amount: totalAmount,
      schedule_id: schedule_id || null
    });

    // Link equipment
    if (equipment_ids && equipment_ids.length > 0) {
      const eqEntries = equipment_ids.map(eId => ({
        booking_id: booking.id,
        equipment_id: eId,
        quantity: 1
      }));
      await BookingEquipment.bulkCreate(eqEntries);
    }

    const fullBooking = await Booking.findByPk(booking.id, {
      include: [
        { model: Court, include: [{ model: Sport }] },
        { model: Equipment },
        { model: Payment }
      ]
    });

    res.status(201).json(fullBooking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const where = {};
    if (req.user.role === 'client') {
      where.client_id = req.user.id;
    }

    const bookings = await Booking.findAll({
      where,
      include: [
        { model: Court, include: [{ model: Sport }] },
        { model: User, as: 'client', attributes: ['id', 'name', 'email'] },
        { model: Equipment },
        { model: Payment }
      ],
      order: [['date', 'DESC'], ['time_slot', 'ASC']]
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        { model: Court, include: [{ model: Sport }] },
        { model: User, as: 'client', attributes: ['id', 'name', 'email'] },
        { model: Equipment },
        { model: Payment }
      ]
    });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.cancel = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.client_id !== req.user.id && req.user.role === 'client') {
      return res.status(403).json({ error: 'Not authorized' });
    }
    await booking.update({ status: 'Cancelled' });
    res.json({ message: 'Booking cancelled', booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const totalBookings = await Booking.count();
    const todayBookings = await Booking.count({ where: { date: today } });
    const pendingBookings = await Booking.count({ where: { status: 'Pending' } });
    const confirmedBookings = await Booking.count({ where: { status: 'Confirmed' } });

    // Revenue
    const payments = await Payment.findAll({ where: { payment_status: 'Success' } });
    const totalRevenue = payments.reduce((sum, p) => sum + parseFloat(p.amount_paid), 0);

    // Daily bookings (last 7 days)
    const dailyBookings = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = await Booking.count({ where: { date: dateStr } });
      dailyBookings.push({ date: dateStr, count });
    }

    // Sport-wise bookings
    const sportBookings = await Booking.findAll({
      include: [{ model: Court, include: [{ model: Sport }] }],
      attributes: ['id']
    });
    const sportCounts = {};
    sportBookings.forEach(b => {
      if (b.Court && b.Court.Sport) {
        const name = b.Court.Sport.name;
        sportCounts[name] = (sportCounts[name] || 0) + 1;
      }
    });

    res.json({
      totalBookings, todayBookings, pendingBookings, confirmedBookings,
      totalRevenue, dailyBookings,
      sportBookings: Object.entries(sportCounts).map(([name, count]) => ({ name, count }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
