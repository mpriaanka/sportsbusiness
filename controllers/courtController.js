const { Court, Sport } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const { sport_id } = req.query;
    const where = sport_id ? { sport_id } : {};
    const courts = await Court.findAll({ where, include: [{ model: Sport }] });
    res.json(courts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const court = await Court.findByPk(req.params.id, { include: [{ model: Sport }] });
    if (!court) return res.status(404).json({ error: 'Court not found' });
    res.json(court);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, sport_id, location, price_per_hour } = req.body;
    if (!name || !sport_id) return res.status(400).json({ error: 'Name and sport_id are required' });
    const court = await Court.create({ name, sport_id, location, price_per_hour });
    res.status(201).json(court);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const court = await Court.findByPk(req.params.id);
    if (!court) return res.status(404).json({ error: 'Court not found' });
    await court.update(req.body);
    res.json(court);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const court = await Court.findByPk(req.params.id);
    if (!court) return res.status(404).json({ error: 'Court not found' });
    await court.destroy();
    res.json({ message: 'Court deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
