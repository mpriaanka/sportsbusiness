const { Equipment, Sport } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const { sport_id } = req.query;
    const where = sport_id ? { sport_id } : {};
    const equipment = await Equipment.findAll({ where, include: [{ model: Sport }] });
    res.json(equipment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, sport_id, price, description, available_quantity } = req.body;
    if (!name || !sport_id) return res.status(400).json({ error: 'Name and sport_id are required' });
    const item = await Equipment.create({ name, sport_id, price, description, available_quantity });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const item = await Equipment.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Equipment not found' });
    await item.update(req.body);
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const item = await Equipment.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Equipment not found' });
    await item.destroy();
    res.json({ message: 'Equipment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
