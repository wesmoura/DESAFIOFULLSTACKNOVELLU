import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import routes from './routes.js';

const app = express();
app.use(express.json());
app.use('/api', routes);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

global.io = io;

io.on('connection', () => {
  console.log('Cliente conectado via WebSocket');
});

server.listen(3000, () => console.log('Backend rodando na porta 3000'));
