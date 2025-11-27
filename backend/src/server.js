import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import routes from './routes.js';

/**
 * Configuração do servidor Express
 */
const app = express();

// Middleware para parsing de JSON
app.use(express.json());

// Rotas da API
app.use('/api', routes);

/**
 * Configuração do servidor HTTP e WebSocket
 */
const server = http.createServer(app);

// Configuração do Socket.io com CORS habilitado
const io = new Server(server, { 
  cors: { 
    origin: '*' // Em produção, especificar domínios permitidos
  } 
});

// Disponibiliza a instância do Socket.io globalmente para uso nas rotas
global.io = io;

// Evento de conexão WebSocket
io.on('connection', (socket) => {
  console.log(`Cliente conectado via WebSocket: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});

// Inicia o servidor na porta 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Backend rodando na porta ${PORT}`);
  console.log(`📡 WebSocket disponível em ws://localhost:${PORT}`);
});
