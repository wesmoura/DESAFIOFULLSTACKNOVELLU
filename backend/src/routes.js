import { Router } from 'express';
import { db } from './db.js';

const router = Router();

/**
 * Obtém a instância do Socket.io para emitir eventos WebSocket
 * @returns {Object} Instância do Socket.io
 */
const getIO = () => global.io;

/**
 * POST /api/devices
 * Cria um novo dispositivo
 * 
 * Validações:
 * - name: obrigatório
 * - mac: obrigatório e único
 * 
 * Emite evento WebSocket: device:created
 */
router.post('/devices', async (req, res) => {
  const { name, mac } = req.body;
  
  // Validação de campos obrigatórios
  if (!name || !mac) {
    return res.status(400).json({ error: 'name e mac obrigatórios' });
  }

  try {
    // Verifica se o MAC já existe (deve ser único)
    const [existing] = await db.query('SELECT * FROM devices WHERE mac=?', [mac]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'MAC já cadastrado' });
    }

    // Insere o novo dispositivo no banco
    const [result] = await db.query('INSERT INTO devices (name, mac) VALUES (?,?)', [name, mac]);
    const device = { id: result.insertId, name, mac, status: 'ATIVO' };

    // Emite evento WebSocket para atualização em tempo real
    getIO().emit('device:created', device);
    
    res.json(device);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/devices
 * Lista todos os dispositivos cadastrados
 * 
 * Retorna array ordenado por ID (mais recente primeiro)
 */
router.get('/devices', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM devices ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * PATCH /api/devices/:id/status
 * Alterna o status do dispositivo entre ATIVO e INATIVO
 * 
 * Emite evento WebSocket: device:status
 */
router.patch('/devices/:id/status', async (req, res) => {
  const { id } = req.params;

  try {
    // Busca o dispositivo pelo ID
    const [[device]] = await db.query('SELECT * FROM devices WHERE id=?', [id]);
    if (!device) {
      return res.status(404).json({ error: 'Device não encontrado' });
    }

    // Alterna o status
    const newStatus = device.status === 'ATIVO' ? 'INATIVO' : 'ATIVO';
    await db.query('UPDATE devices SET status=? WHERE id=?', [newStatus, id]);

    // Prepara o objeto atualizado
    const updated = { ...device, status: newStatus };
    
    // Emite evento WebSocket para atualização em tempo real
    getIO().emit('device:status', updated);
    
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
