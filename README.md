# 🚀 Desafio FullStack Novellus

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)
![Vue.js](https://img.shields.io/badge/Vue.js-3.4-4FC08D?style=for-the-badge&logo=vue.js)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql)
![Socket.io](https://img.shields.io/badge/Socket.io-4.8-010101?style=for-the-badge&logo=socket.io)

**Sistema full-stack para cadastro de dispositivos com atualização em tempo real via WebSocket**

[📖 Documentação](#-passo-a-passo-completo) • [🔌 API](#-api-endpoints) • [🧪 Testes](#-testes) • [❓ Troubleshooting](#-troubleshooting)

</div>

---

## 📝 Sobre o Projeto

Sistema completo de gerenciamento de dispositivos desenvolvido como desafio técnico. Permite cadastrar dispositivos com endereço MAC, gerenciar seus status (ATIVO/INATIVO) e receber atualizações em tempo real através de WebSocket.

### ✨ Principais Funcionalidades

- ✅ **CRUD completo** de dispositivos
- ✅ **Atualização em tempo real** via WebSocket
- ✅ **Validações robustas** (campos obrigatórios, MAC único)
- ✅ **Interface moderna** com tema escuro
- ✅ **Testes automatizados** (unitários e integração)
- ✅ **Documentação completa** e passo a passo

## 📋 Índice

- [Pré-requisitos](#-pré-requisitos)
- [Passo a Passo Completo](#-passo-a-passo-completo)
- [Tecnologias](#-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [API Endpoints](#-api-endpoints)
- [Testes](#-testes)
- [Troubleshooting](#-troubleshooting)

---

## 🔧 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

1. **Node.js** (versão 18 ou superior)
   - Download: https://nodejs.org/
   - Verificar instalação: `node --version`
   - Verificar npm: `npm --version`

2. **MySQL** (versão 8 ou superior)
   - Download: https://dev.mysql.com/downloads/mysql/
   - Ou use XAMPP/WAMP que inclui MySQL
   - Verificar instalação: `mysql --version`

3. **Git** (opcional, para clonar do GitHub)
   - Download: https://git-scm.com/

4. **Editor de Código** (VS Code, WebStorm, etc.)

---

## 🚀 Passo a Passo Completo

### **PASSO 1: Baixar/Clonar o Projeto**

#### Opção A: Clonar via Git
```bash
git clone https://github.com/wesmoura/DESAFIOFULLSTACKNOVELLU.git
cd DESAFIOFULLSTACKNOVELLU
```

#### Opção B: Baixar ZIP
1. Acesse: https://github.com/wesmoura/DESAFIOFULLSTACKNOVELLU
2. Clique em "Code" → "Download ZIP"
3. Extraia o arquivo ZIP
4. Abra a pasta extraída no seu editor de código

---

### **PASSO 2: Verificar a Estrutura do Projeto**

Você deve ver a seguinte estrutura:
```
DESAFIOFULLSTACKNOVELLU/
├── backend/
│   ├── src/
│   │   ├── db.js
│   │   ├── routes.js
│   │   └── server.js
│   ├── tests/
│   │   └── run-tests.js
│   ├── package.json
│   └── setup-db.js
├── frontend/
│   ├── App.vue
│   ├── index.html
│   ├── main.js
│   ├── package.json
│   └── vite.config.js
├── database/
│   └── schema.sql
├── .gitignore
└── README.md
```

---

### **PASSO 3: Configurar o MySQL**

#### 3.1. Iniciar o MySQL
- **Windows**: Abra o MySQL Workbench ou inicie o serviço MySQL pelo Painel de Controle
- **Linux/Mac**: `sudo service mysql start` ou `brew services start mysql`

#### 3.2. Criar o Banco de Dados

**Opção A: Usando o script automático (Recomendado)**
```bash
cd backend
npm install
npm run setup-db
```

**Opção B: Manualmente via MySQL**
1. Abra o MySQL Workbench ou terminal MySQL
2. Execute o SQL do arquivo `database/schema.sql`:
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

#### 3.3. Configurar Credenciais do MySQL

Edite o arquivo `backend/src/db.js` com suas credenciais:

```javascript
export const db = await mysql.createPool({
  host: 'localhost',        // Seu host MySQL
  user: 'root',            // Seu usuário MySQL
  password: '',             // Sua senha MySQL (deixe vazio se não tiver)
  database: 'devicesdb'     // Nome do banco criado
});
```

**⚠️ IMPORTANTE**: Se você usa XAMPP/WAMP, geralmente:
- Usuário: `root`
- Senha: `''` (vazio) ou a senha que você configurou

---

### **PASSO 4: Instalar Dependências do Backend**

Abra um terminal na pasta raiz do projeto e execute:

```bash
cd backend
npm install
```

**O que acontece aqui?**
- O npm baixa todas as dependências listadas no `package.json`
- Cria a pasta `node_modules` com todas as bibliotecas
- Isso pode levar alguns minutos na primeira vez

**Dependências instaladas:**
- express (servidor web)
- mysql2 (conexão com MySQL)
- socket.io (WebSocket)
- supertest (testes)

---

### **PASSO 5: Instalar Dependências do Frontend**

Abra um **NOVO terminal** (mantenha o anterior aberto) e execute:

```bash
cd frontend
npm install
```

**Dependências instaladas:**
- vue (framework frontend)
- socket.io-client (cliente WebSocket)
- vite (servidor de desenvolvimento)
- @vitejs/plugin-vue (plugin Vue para Vite)

---

### **PASSO 6: Iniciar o Backend**

No terminal onde você instalou as dependências do backend:

```bash
cd backend
npm run dev
```

**O que você deve ver:**
```
✅ Conectado ao banco de dados MySQL
Backend rodando na porta 3000
```

**✅ SUCESSO**: Se aparecer "Backend rodando na porta 3000", está funcionando!

**❌ ERRO**: Se aparecer erro de conexão MySQL:
- Verifique se o MySQL está rodando
- Verifique as credenciais em `backend/src/db.js`
- Verifique se o banco `devicesdb` foi criado

**⚠️ MANTENHA ESTE TERMINAL ABERTO!** O backend precisa ficar rodando.

---

### **PASSO 7: Iniciar o Frontend**

Abra um **NOVO terminal** (agora você terá 2 terminais abertos) e execute:

```bash
cd frontend
npm run dev
```

**O que você deve ver:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**✅ SUCESSO**: O frontend está rodando em `http://localhost:5173`

---

### **PASSO 8: Acessar a Aplicação**

1. Abra seu navegador (Chrome, Firefox, Edge, etc.)
2. Acesse: **http://localhost:5173**
3. Você verá a interface do sistema!

---

### **PASSO 9: Testar a Aplicação**

1. **Cadastrar um dispositivo:**
   - Preencha "Nome do Dispositivo" (ex: "Router TP-Link")
   - Preencha "Endereço MAC" (ex: "AA:BB:CC:DD:EE:FF")
   - Clique em "Cadastrar Dispositivo"

2. **Ver o dispositivo na tabela:**
   - O dispositivo deve aparecer na tabela abaixo
   - Status inicial será "ATIVO" (verde)

3. **Alternar status:**
   - Clique no botão "Desativar" na linha do dispositivo
   - O status deve mudar para "INATIVO" (vermelho)

4. **Testar atualização em tempo real:**
   - Abra outra aba do navegador em `http://localhost:5173`
   - Cadastre um novo dispositivo em uma aba
   - Veja aparecer automaticamente na outra aba! 🎉

---

## 🧪 Testes

Para executar os testes automatizados:

```bash
cd backend
npm test
```

**O que os testes verificam:**
- ✅ 1 teste unitário: Validação de MAC único no banco
- ✅ 6 testes de integração:
  - POST /api/devices (criar dispositivo)
  - POST /api/devices (validação de campos obrigatórios)
  - POST /api/devices (validação de MAC único)
  - GET /api/devices (listar dispositivos)
  - PATCH /api/devices/:id/status (alternar status)
  - PATCH /api/devices/:id/status (device não encontrado)

---

## 📁 Estrutura do Projeto

```
DESAFIOFULLSTACKNOVELLU/
│
├── backend/                 # Servidor Node.js
│   ├── src/
│   │   ├── server.js       # Configuração do servidor Express + Socket.io
│   │   ├── routes.js       # Rotas da API (POST, GET, PATCH)
│   │   └── db.js           # Conexão com MySQL
│   ├── tests/
│   │   └── run-tests.js    # Testes automatizados
│   ├── package.json        # Dependências do backend
│   └── setup-db.js         # Script para criar banco de dados
│
├── frontend/                # Aplicação Vue 3
│   ├── App.vue             # Componente principal
│   ├── main.js             # Ponto de entrada Vue
│   ├── index.html          # HTML base
│   ├── vite.config.js      # Configuração do Vite
│   └── package.json        # Dependências do frontend
│
├── database/
│   └── schema.sql          # Schema do banco de dados MySQL
│
├── .gitignore              # Arquivos ignorados pelo Git
└── README.md               # Este arquivo
```

---

## 🔌 API Endpoints

### `POST /api/devices`
Cria um novo dispositivo.

**Request:**
```json
{
  "name": "Router TP-Link",
  "mac": "AA:BB:CC:DD:EE:FF"
}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "Router TP-Link",
  "mac": "AA:BB:CC:DD:EE:FF",
  "status": "ATIVO"
}
```

**Validações:**
- `name` é obrigatório
- `mac` é obrigatório e único

---

### `GET /api/devices`
Lista todos os dispositivos.

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Router TP-Link",
    "mac": "AA:BB:CC:DD:EE:FF",
    "status": "ATIVO",
    "created_at": "2025-01-XX XX:XX:XX"
  }
]
```

---

### `PATCH /api/devices/:id/status`
Alterna o status do dispositivo (ATIVO ↔ INATIVO).

**Response (200):**
```json
{
  "id": 1,
  "name": "Router TP-Link",
  "mac": "AA:BB:CC:DD:EE:FF",
  "status": "INATIVO"
}
```

---

## 🔄 WebSocket Events

O sistema emite eventos em tempo real via Socket.io:

### `device:created`
Emitido quando um novo dispositivo é criado.

**Payload:**
```json
{
  "id": 1,
  "name": "Router TP-Link",
  "mac": "AA:BB:CC:DD:EE:FF",
  "status": "ATIVO"
}
```

### `device:status`
Emitido quando o status de um dispositivo é alterado.

**Payload:**
```json
{
  "id": 1,
  "name": "Router TP-Link",
  "mac": "AA:BB:CC:DD:EE:FF",
  "status": "INATIVO"
}
```

---

## 🛠️ Tecnologias

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Socket.io** - WebSocket para tempo real
- **MySQL2** - Driver MySQL
- **Supertest** - Testes de API

### Frontend
- **Vue 3** - Framework JavaScript
- **Vite** - Build tool e dev server
- **Socket.io-client** - Cliente WebSocket

### Banco de Dados
- **MySQL** - Banco de dados relacional

---

## ❗ Troubleshooting

### Erro: "Cannot find module"
**Solução:** Execute `npm install` na pasta do backend ou frontend.

### Erro: "ECONNREFUSED" ou "MySQL não conecta"
**Soluções:**
1. Verifique se o MySQL está rodando
2. Verifique as credenciais em `backend/src/db.js`
3. Verifique se o banco `devicesdb` existe
4. Teste a conexão: `mysql -u root -p`

### Erro: "Port 3000 already in use"
**Solução:** Altere a porta no `backend/src/server.js` ou feche o processo que está usando a porta 3000.

### Erro: "Port 5173 already in use"
**Solução:** O Vite automaticamente usa outra porta. Veja qual porta foi atribuída no terminal.

### Frontend não conecta com Backend
**Soluções:**
1. Verifique se o backend está rodando em `http://localhost:3000`
2. Abra o DevTools (F12) e veja os erros no Console
3. Verifique se há erros de CORS

### WebSocket não funciona
**Soluções:**
1. Verifique se o backend está rodando
2. Verifique o indicador de conexão no topo da página (deve estar verde)
3. Abra o DevTools → Network → WS e veja se há conexão WebSocket

### Banco de dados não cria
**Soluções:**
1. Execute manualmente o SQL em `database/schema.sql`
2. Verifique se tem permissões no MySQL
3. Tente criar o banco manualmente: `CREATE DATABASE devicesdb;`

---

## 🏗️ Arquitetura e Decisões Técnicas

### Estrutura do Projeto

O projeto segue uma arquitetura **MVC simplificada** com separação clara de responsabilidades:

```
backend/
├── src/
│   ├── server.js    # Configuração do servidor e WebSocket
│   ├── routes.js     # Lógica de negócio e rotas da API
│   └── db.js         # Camada de acesso a dados
└── tests/            # Testes automatizados

frontend/
├── App.vue          # Componente principal (Single File Component)
├── main.js          # Ponto de entrada Vue
└── vite.config.js   # Configuração do build tool
```

### Decisões Técnicas

#### Backend
- **Express.js**: Framework web minimalista e flexível
- **Socket.io**: Biblioteca robusta para WebSocket com fallback automático
- **MySQL2**: Driver oficial do MySQL com suporte a Promises
- **Connection Pool**: Gerenciamento eficiente de conexões com o banco

#### Frontend
- **Vue 3 Composition API**: Código mais organizado e reutilizável
- **Vite**: Build tool rápido com HMR (Hot Module Replacement)
- **Single File Components**: Organização e encapsulamento de componentes

#### Banco de Dados
- **MySQL**: Banco relacional confiável e amplamente usado
- **ENUM para status**: Garantia de integridade dos dados
- **Índice único em MAC**: Performance e validação de unicidade

### Padrões de Código

- **ES6 Modules**: Import/export para modularidade
- **Async/Await**: Tratamento assíncrono moderno
- **JSDoc**: Documentação inline do código
- **Error Handling**: Try/catch em todas as operações críticas
- **RESTful API**: Padrão REST para endpoints

### Segurança

- ✅ Validação de entrada em todas as rotas
- ✅ Prepared Statements (proteção contra SQL Injection)
- ✅ Tratamento de erros sem expor detalhes sensíveis
- ⚠️ CORS configurado para desenvolvimento (ajustar para produção)

---

## 📝 Comandos Úteis

```bash
# Instalar dependências do backend
cd backend && npm install

# Instalar dependências do frontend
cd frontend && npm install

# Rodar backend em modo desenvolvimento
cd backend && npm run dev

# Rodar frontend em modo desenvolvimento
cd frontend && npm run dev

# Executar testes
cd backend && npm test

# Criar banco de dados
cd backend && npm run setup-db
```

---

## ✅ Checklist de Instalação

Use este checklist para garantir que tudo está configurado:

- [ ] Node.js instalado (`node --version`)
- [ ] MySQL instalado e rodando
- [ ] Projeto clonado/baixado
- [ ] Banco de dados `devicesdb` criado
- [ ] Credenciais MySQL configuradas em `backend/src/db.js`
- [ ] Dependências do backend instaladas (`npm install` no backend)
- [ ] Dependências do frontend instaladas (`npm install` no frontend)
- [ ] Backend rodando sem erros (`npm run dev` no backend)
- [ ] Frontend rodando sem erros (`npm run dev` no frontend)
- [ ] Aplicação acessível em `http://localhost:5173`

---

## 🎉 Pronto!

Se você seguiu todos os passos, sua aplicação está rodando! 

**Acesse:** http://localhost:5173

**Divirta-se testando o sistema!** 🚀

---

## 📧 Suporte

Se encontrar problemas, verifique:
1. A seção [Troubleshooting](#-troubleshooting)
2. Os logs no terminal do backend
3. O console do navegador (F12 → Console)

---

**Desenvolvido para o Desafio FullStack Novellus** 💜
