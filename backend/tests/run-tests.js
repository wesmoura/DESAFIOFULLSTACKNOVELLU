import http from 'http';
import express from 'express';
import { Server } from 'socket.io';
import request from 'supertest';
import routes from '../src/routes.js';
import { db } from '../src/db.js';

// Configurar servidor de teste
const app = express();
app.use(express.json());
app.use('/api', routes);

const server = http.createServer(app);
const io = new Server(server);
global.io = io;

let testServer;

async function beforeAll() {
  // Limpar tabela antes dos testes
  try {
    await db.query('DELETE FROM devices');
  } catch (err) {
    // Tabela pode não existir ainda
  }
  return new Promise((resolve) => {
    testServer = server.listen(3001, () => {
      console.log('Servidor de teste rodando na porta 3001');
      resolve();
    });
  });
}

async function afterAll() {
  try {
    await db.query('DELETE FROM devices');
  } catch (err) {
    // Ignorar erros
  }
  return new Promise((resolve) => {
    testServer.close(() => {
      db.end().then(() => resolve());
    });
  });
}

// Teste Unitário: Validação de MAC único
async function testMacUniqueness() {
  console.log('\n🧪 Teste Unitário: Validação de MAC único');
  
  try {
    // Limpar antes
    await db.query('DELETE FROM devices');
    
    // Inserir primeiro dispositivo
    await db.query('INSERT INTO devices (name, mac) VALUES (?, ?)', ['Device 1', 'AA:BB:CC:DD:EE:FF']);
    
    // Tentar inserir com mesmo MAC (deve falhar)
    try {
      await db.query('INSERT INTO devices (name, mac) VALUES (?, ?)', ['Device 2', 'AA:BB:CC:DD:EE:FF']);
      console.log('❌ FALHOU: Deveria ter impedido MAC duplicado');
      await db.query('DELETE FROM devices');
      return false;
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        console.log('✅ PASSOU: MAC duplicado foi rejeitado corretamente');
        await db.query('DELETE FROM devices');
        return true;
      } else {
        throw err;
      }
    }
  } catch (err) {
    console.log('❌ ERRO:', err.message);
    return false;
  }
}

// Testes de Integração
async function runIntegrationTests() {
  console.log('\n🧪 Testes de Integração:\n');
  
  let passed = 0;
  let failed = 0;

  // Limpar antes dos testes
  try {
    await db.query('DELETE FROM devices');
  } catch (err) {
    // Ignorar
  }

  // Teste 1: POST /api/devices - Criar dispositivo
  try {
    const response = await request(app)
      .post('/api/devices')
      .send({ name: 'Test Device', mac: '11:22:33:44:55:66' })
      .expect(200);

    if (response.body.name === 'Test Device' && response.body.mac === '11:22:33:44:55:66') {
      console.log('✅ POST /api/devices - Criar dispositivo: PASSOU');
      passed++;
    } else {
      console.log('❌ POST /api/devices - Criar dispositivo: FALHOU');
      failed++;
    }
  } catch (err) {
    console.log('❌ POST /api/devices - Criar dispositivo: FALHOU -', err.message);
    failed++;
  }

  // Teste 2: POST /api/devices - Validação de campos obrigatórios
  try {
    await request(app)
      .post('/api/devices')
      .send({ name: 'Test' })
      .expect(400);
    console.log('✅ POST /api/devices - Validação name/mac obrigatórios: PASSOU');
    passed++;
  } catch (err) {
    console.log('❌ POST /api/devices - Validação name/mac obrigatórios: FALHOU');
    failed++;
  }

  // Teste 3: POST /api/devices - Validação de MAC único
  try {
    await request(app)
      .post('/api/devices')
      .send({ name: 'Test Device 2', mac: '11:22:33:44:55:66' })
      .expect(400);
    console.log('✅ POST /api/devices - Validação MAC único: PASSOU');
    passed++;
  } catch (err) {
    console.log('❌ POST /api/devices - Validação MAC único: FALHOU');
    failed++;
  }

  // Teste 4: GET /api/devices - Listar dispositivos
  try {
    const response = await request(app)
      .get('/api/devices')
      .expect(200);

    if (Array.isArray(response.body) && response.body.length > 0) {
      console.log('✅ GET /api/devices - Listar dispositivos: PASSOU');
      passed++;
    } else {
      console.log('❌ GET /api/devices - Listar dispositivos: FALHOU');
      failed++;
    }
  } catch (err) {
    console.log('❌ GET /api/devices - Listar dispositivos: FALHOU -', err.message);
    failed++;
  }

  // Teste 5: PATCH /api/devices/:id/status - Alternar status
  try {
    // Criar dispositivo para testar
    const createResponse = await request(app)
      .post('/api/devices')
      .send({ name: 'Toggle Test', mac: '99:88:77:66:55:44' });

    const deviceId = createResponse.body.id;
    const initialStatus = createResponse.body.status;

    const toggleResponse = await request(app)
      .patch(`/api/devices/${deviceId}/status`)
      .expect(200);

    const newStatus = toggleResponse.body.status;
    
    if (newStatus !== initialStatus && (newStatus === 'ATIVO' || newStatus === 'INATIVO')) {
      console.log('✅ PATCH /api/devices/:id/status - Alternar status: PASSOU');
      passed++;
    } else {
      console.log('❌ PATCH /api/devices/:id/status - Alternar status: FALHOU');
      failed++;
    }
  } catch (err) {
    console.log('❌ PATCH /api/devices/:id/status - Alternar status: FALHOU -', err.message);
    failed++;
  }

  // Teste 6: PATCH /api/devices/:id/status - Device não encontrado
  try {
    await request(app)
      .patch('/api/devices/99999/status')
      .expect(404);
    console.log('✅ PATCH /api/devices/:id/status - Device não encontrado: PASSOU');
    passed++;
  } catch (err) {
    console.log('❌ PATCH /api/devices/:id/status - Device não encontrado: FALHOU');
    failed++;
  }

  return { passed, failed };
}

// Executar todos os testes
async function runAllTests() {
  console.log('='.repeat(50));
  console.log('🚀 Iniciando testes...');
  console.log('='.repeat(50));

  try {
    await beforeAll();

    // Limpar banco antes de começar
    try {
      await db.query('DELETE FROM devices');
    } catch (err) {
      // Ignorar
    }

    // Teste unitário
    const unitTestPassed = await testMacUniqueness();

    // Testes de integração
    const { passed, failed } = await runIntegrationTests();

    // Resumo
    console.log('\n' + '='.repeat(50));
    console.log('📊 RESUMO DOS TESTES:');
    console.log('='.repeat(50));
    console.log(`✅ Teste Unitário: ${unitTestPassed ? 'PASSOU' : 'FALHOU'}`);
    console.log(`✅ Testes de Integração: ${passed} passaram, ${failed} falharam`);
    console.log(`📈 Total: ${unitTestPassed ? 1 : 0} unitário + ${passed} integração = ${(unitTestPassed ? 1 : 0) + passed} testes passaram`);
    console.log('='.repeat(50));

    // Limpar após testes
    await afterAll();
    process.exit(failed > 0 || !unitTestPassed ? 1 : 0);
  } catch (err) {
    console.error('❌ Erro ao executar testes:', err);
    await afterAll();
    process.exit(1);
  }
}

runAllTests();
