# Sistema de Cadastro de Dispositivos

Sistema full-stack para cadastro de dispositivos com atualização em tempo real via WebSocket.

## Tecnologias

- **Backend**: Node.js + Express + Socket.io + MySQL
- **Frontend**: Vue 3 + Socket.io-client + Vite
- **Banco de Dados**: MySQL

## Pré-requisitos

- Node.js (v18 ou superior)
- MySQL (v8 ou superior)
- npm ou yarn

## Instalação

### 1. Configurar Banco de Dados

Certifique-se de que o MySQL está rodando e execute:

```bash
cd backend
npm run setup-db
```

Ou execute manualmente o SQL em `database/schema.sql`:

```sql
CREATE DATABASE IF NOT EXISTS devicesdb;
USE devicesdb;

CREATE TABLE devices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  mac VARCHAR(32) NOT NULL UNIQUE,
  status ENUM('ATIVO','INATIVO') NOT NULL DEFAULT 'ATIVO',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Configurar Backend

```bash
cd backend
npm install
```

Edite `src/db.js` com suas credenciais do MySQL se necessário:
- host: 'localhost'
- user: 'root' (ou seu usuário)
- password: '' (ou sua senha)
- database: 'devicesdb'

### 3. Configurar Frontend

```bash
cd frontend
npm install
```

## Execução

### Backend

```bash
cd backend
npm run dev
```

O backend estará rodando em `http://localhost:3000`

### Frontend

```bash
cd frontend
npm run dev
```

O frontend estará rodando em `http://localhost:5173` (ou porta similar do Vite)

## Testes

```bash
cd backend
npm test
```

Os testes incluem:
- 1 teste unitário (validação de MAC único)
- 6 testes de integração (todas as rotas)

## API Endpoints

- `POST /api/devices` - Cria um dispositivo
  - Body: `{ "name": "string", "mac": "string" }`
  - Validações: name e mac obrigatórios, mac único

- `GET /api/devices` - Lista todos os dispositivos
  - Retorna array de dispositivos ordenados por ID (mais recente primeiro)

- `PATCH /api/devices/:id/status` - Alterna o status do dispositivo
  - Alterna entre ATIVO e INATIVO

## WebSocket Events

- `device:created` - Emitido quando um novo dispositivo é criado
  - Payload: `{ id, name, mac, status }`

- `device:status` - Emitido quando o status de um dispositivo é alterado
  - Payload: `{ id, name, mac, status }`

## Funcionalidades

✅ Cadastro de dispositivos com validação
✅ Listagem de dispositivos
✅ Alternância de status (ATIVO/INATIVO)
✅ Atualização em tempo real via WebSocket
✅ Testes unitários e de integração
✅ Interface moderna e responsiva

