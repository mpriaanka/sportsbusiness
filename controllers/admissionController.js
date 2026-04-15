const { Admission, User, Sport } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const where = req.user.role === 'client' ? { client_id: req.user.id } : {};
    const admissions = await Admission.findAll({
      where,
      include: [
        { model: User, as: 'admClient', attributes: ['id', 'name', 'email'] },
        { model: Sport }
      ]
    });
    res.json(admissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { sport_id, fee, start_date, end_date } = req.body;
    if (!sport_id || !fee || !start_date) {
      return res.status(400).json({ error: 'sport_id, fee, and start_date are required' });
    }
    const admission = await Admission.create({
      client_id: req.user.id,
      sport_id, fee, start_date, end_date
    });
    res.status(201).json(admission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.cancel = async (req, res) => {
  try {
    const admission = await Admission.findByPk(req.params.id);
    if (!admission) return res.status(404).json({ error: 'Not found' });
    await admission.update({ status: 'Cancelled' });
    res.json(admission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
