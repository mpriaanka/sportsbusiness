const { Sport, Court, Equipment } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const sports = await Sport.findAll({
      include: [
        { model: Court },
        { model: Equipment }
      ]
    });
    res.json(sports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const sport = await Sport.findByPk(req.params.id, {
      include: [{ model: Court }, { model: Equipment }]
    });
    if (!sport) return res.status(404).json({ error: 'Sport not found' });
    res.json(sport);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, description, icon, academy_id } = req.body;
    if (!name) return res.status(400).json({ error: 'Sport name is required' });
    const sport = await Sport.create({ name, description, icon, academy_id });
    res.status(201).json(sport);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const sport = await Sport.findByPk(req.params.id);
    if (!sport) return res.status(404).json({ error: 'Sport not found' });
    await sport.update(req.body);
    res.json(sport);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const sport = await Sport.findByPk(req.params.id);
    if (!sport) return res.status(404).json({ error: 'Sport not found' });
    await sport.destroy();
    res.json({ message: 'Sport deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
