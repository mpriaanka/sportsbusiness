const { Schedule, Sport, Court, User } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const { sport_id, court_id } = req.query;
    const where = {};
    if (sport_id) where.sport_id = sport_id;
    if (court_id) where.court_id = court_id;
    const schedules = await Schedule.findAll({
      where,
      include: [
        { model: Sport },
        { model: Court },
        { model: User, as: 'manager', attributes: ['id', 'name', 'email'] }
      ]
    });
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { sport_id, court_id, day_of_week, start_time, end_time } = req.body;
    if (!sport_id || !court_id || !day_of_week || !start_time || !end_time) {
      return res.status(400).json({ error: 'All fields required' });
    }
    const schedule = await Schedule.create({
      sport_id, court_id, day_of_week, start_time, end_time,
      manager_id: req.user.id
    });
    res.status(201).json(schedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const schedule = await Schedule.findByPk(req.params.id);
    if (!schedule) return res.status(404).json({ error: 'Schedule not found' });
    await schedule.update(req.body);
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const schedule = await Schedule.findByPk(req.params.id);
    if (!schedule) return res.status(404).json({ error: 'Schedule not found' });
    await schedule.destroy();
    res.json({ message: 'Schedule deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
