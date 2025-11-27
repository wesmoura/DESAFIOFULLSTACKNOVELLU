import { Router } from 'express';
import { db } from './db.js';

const router = Router();

const getIO = () => global.io;

router.post('/devices', async (req, res) => {
  const { name, mac } = req.body;
  if (!name || !mac) {
    return res.status(400).json({ error: 'name e mac obrigatórios' });
  }

  try {
    const [existing] = await db.query('SELECT * FROM devices WHERE mac=?', [mac]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'MAC já cadastrado' });
    }

    const [result] = await db.query('INSERT INTO devices (name, mac) VALUES (?,?)', [name, mac]);
    const device = { id: result.insertId, name, mac, status: 'ATIVO' };

    getIO().emit('device:created', device);
    res.json(device);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/devices', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM devices ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/devices/:id/status', async (req, res) => {
  const { id } = req.params;

  try {
    const [[device]] = await db.query('SELECT * FROM devices WHERE id=?', [id]);
    if (!device) {
      return res.status(404).json({ error: 'Device não encontrado' });
    }

    const newStatus = device.status === 'ATIVO' ? 'INATIVO' : 'ATIVO';
    await db.query('UPDATE devices SET status=? WHERE id=?', [newStatus, id]);

    const updated = { ...device, status: newStatus };
    getIO().emit('device:status', updated);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
