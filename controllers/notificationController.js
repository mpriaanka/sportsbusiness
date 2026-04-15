const { Notification, User } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { user_id: req.user.id },
      include: [{ model: User, as: 'sender', attributes: ['id', 'name', 'role'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.send = async (req, res) => {
  try {
    const { user_id, title, message, type } = req.body;
    if (!user_id || !title || !message) {
      return res.status(400).json({ error: 'user_id, title, and message are required' });
    }
    const notification = await Notification.create({
      user_id, sender_id: req.user.id,
      title, message,
      type: type || 'general'
    });
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.sendBulk = async (req, res) => {
  try {
    const { title, message, type, role } = req.body;
    if (!title || !message) {
      return res.status(400).json({ error: 'title and message are required' });
    }
    const where = role ? { role } : {};
    const users = await User.findAll({ where, attributes: ['id'] });
    const notifications = users.map(u => ({
      user_id: u.id, sender_id: req.user.id,
      title, message, type: type || 'general'
    }));
    await Notification.bulkCreate(notifications);
    res.status(201).json({ message: `Sent to ${users.length} users` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markRead = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Not found' });
    await notification.update({ is_read: true });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markAllRead = async (req, res) => {
  try {
    await Notification.update(
      { is_read: true },
      { where: { user_id: req.user.id, is_read: false } }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
