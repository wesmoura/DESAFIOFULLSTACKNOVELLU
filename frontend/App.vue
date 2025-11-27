<script setup>
import { ref, onMounted, computed } from 'vue';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5
});

const devices = ref([]);
const name = ref('');
const mac = ref('');
const isConnected = ref(false);
const isLoading = ref(false);

// Status de conexão
socket.on('connect', () => {
  isConnected.value = true;
});

socket.on('disconnect', () => {
  isConnected.value = false;
});

async function load() {
  isLoading.value = true;
  try {
    const response = await fetch('http://localhost:3000/api/devices');
    if (response.ok) {
      devices.value = await response.json();
    }
  } catch (error) {
    console.error('Erro ao carregar dispositivos:', error);
  } finally {
    isLoading.value = false;
  }
}

async function add() {
  if (!name.value.trim() || !mac.value.trim()) {
    alert('Nome e MAC são obrigatórios');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/devices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.value.trim(), mac: mac.value.trim() })
    });

    if (!response.ok) {
      const error = await response.json();
      alert(error.error || 'Erro ao cadastrar dispositivo');
      return;
    }

    name.value = '';
    mac.value = '';
  } catch (error) {
    console.error('Erro ao cadastrar:', error);
    alert('Erro ao cadastrar dispositivo. Verifique se o backend está rodando.');
  }
}

async function toggle(id) {
  try {
    const response = await fetch(`http://localhost:3000/api/devices/${id}/status`, {
      method: 'PATCH'
    });

    if (!response.ok) {
      const error = await response.json();
      alert(error.error || 'Erro ao alterar status');
    }
  } catch (error) {
    console.error('Erro ao alterar status:', error);
    alert('Erro ao alterar status. Verifique se o backend está rodando.');
  }
}

const deviceCount = computed(() => devices.value.length);

onMounted(() => {
  load();
  socket.on('device:created', (d) => {
    devices.value.unshift(d);
  });
  socket.on('device:status', (d) => {
    const idx = devices.value.findIndex(x => x.id === d.id);
    if (idx >= 0) {
      devices.value[idx] = d;
    }
  });
});
</script>

<template>
  <div class="app-container">
    <!-- Header -->
    <header class="header">
      <h1 class="title">Desafio FullStack Novellus</h1>
      <p class="subtitle">Cadastre e monitore dispositivos em tempo real</p>
      
      <!-- Status de Conexão -->
      <div class="connection-status">
        <span 
          class="status-indicator" 
          :class="{ 'connected': isConnected, 'disconnected': !isConnected }"
        ></span>
        <span class="status-text">{{ isConnected ? 'Conectado' : 'Desconectado' }}</span>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Card: Novo Dispositivo -->
      <div class="card new-device-card">
        <div class="card-header">
          <div class="icon-circle blue">
            <span class="icon">+</span>
          </div>
          <h2 class="card-title">Novo Dispositivo</h2>
        </div>
        
        <form @submit.prevent="add" class="device-form">
          <div class="form-group">
            <label class="form-label">Nome do Dispositivo</label>
            <input 
              v-model="name" 
              type="text"
              placeholder="Ex: Router TP-Link"
              class="form-input"
              required
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Endereço MAC</label>
            <input 
              v-model="mac" 
              type="text"
              placeholder="Ex: AA:BB:CC:DD:EE:FF"
              class="form-input"
              required
            />
          </div>
          
          <button type="submit" class="btn-primary">
            Cadastrar Dispositivo
          </button>
        </form>
      </div>

      <!-- Card: Dispositivos Cadastrados -->
      <div class="card devices-card">
        <div class="card-header">
          <div class="icon-circle purple">
            <span class="icon">💻</span>
          </div>
          <div class="card-header-content">
            <h2 class="card-title">Dispositivos Cadastrados</h2>
            <span class="device-count">{{ deviceCount }} {{ deviceCount === 1 ? 'dispositivo' : 'dispositivos' }}</span>
          </div>
        </div>

        <div class="table-container">
          <table class="devices-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>MAC</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="isLoading">
                <td colspan="5" class="loading-cell">
                  Carregando dispositivos...
                </td>
              </tr>
              <tr v-else-if="devices.length === 0">
                <td colspan="5" class="empty-cell">
                  Nenhum dispositivo cadastrado
                </td>
              </tr>
              <tr v-else v-for="d in devices" :key="d.id" class="table-row">
                <td class="table-cell">{{ d.id }}</td>
                <td class="table-cell">{{ d.name }}</td>
                <td class="table-cell mac-cell">{{ d.mac }}</td>
                <td class="table-cell">
                  <span 
                    class="status-badge" 
                    :class="{ 'active': d.status === 'ATIVO', 'inactive': d.status === 'INATIVO' }"
                  >
                    {{ d.status }}
                  </span>
                </td>
                <td class="table-cell">
                  <button 
                    @click="toggle(d.id)"
                    class="btn-action"
                    :class="{ 'btn-activate': d.status === 'INATIVO', 'btn-deactivate': d.status === 'ATIVO' }"
                  >
                    <span class="btn-icon">⚡</span>
                    {{ d.status === 'INATIVO' ? 'Ativar' : 'Desativar' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  padding: 40px 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: #e0e0e0;
}

/* Header */
.header {
  text-align: center;
  margin-bottom: 40px;
}

.title {
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 1.1rem;
  color: #b0b0b0;
  margin-bottom: 20px;
}

.connection-status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.status-indicator.connected {
  background: #10b981;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
}

.status-indicator.disconnected {
  background: #ef4444;
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
}

.status-text {
  font-size: 0.9rem;
  font-weight: 500;
}

/* Main Content */
.main-content {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 30px;
}

@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr;
  }
}

/* Cards */
.card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
}

.card-header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
}

.device-count {
  font-size: 0.9rem;
  color: #a0a0a0;
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 12px;
  border-radius: 12px;
}

.icon-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
}

.icon-circle.blue {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.icon-circle.purple {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  color: white;
}

.icon {
  font-size: 1.8rem;
}

/* Form */
.device-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 0.9rem;
  color: #b0b0b0;
  font-weight: 500;
}

.form-input {
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}

.form-input::placeholder {
  color: #666;
}

/* Buttons */
.btn-primary {
  padding: 14px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-activate {
  background: #10b981;
  color: white;
}

.btn-activate:hover {
  background: #059669;
  transform: translateY(-1px);
}

.btn-deactivate {
  background: #ef4444;
  color: white;
}

.btn-deactivate:hover {
  background: #dc2626;
  transform: translateY(-1px);
}

.btn-icon {
  font-size: 1rem;
}

/* Table */
.table-container {
  overflow-x: auto;
  border-radius: 12px;
}

.devices-table {
  width: 100%;
  border-collapse: collapse;
}

.devices-table thead {
  background: rgba(255, 255, 255, 0.1);
}

.devices-table th {
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: #fff;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}

.table-row {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: background 0.2s ease;
}

.table-row:hover {
  background: rgba(255, 255, 255, 0.05);
}

.table-cell {
  padding: 16px;
  color: #e0e0e0;
}

.mac-cell {
  font-family: 'Courier New', monospace;
  color: #a0a0a0;
}

.status-badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.active {
  background: #10b981;
  color: white;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.3);
}

.status-badge.inactive {
  background: #ef4444;
  color: white;
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.3);
}

.loading-cell,
.empty-cell {
  padding: 40px;
  text-align: center;
  color: #888;
  font-style: italic;
}

/* Responsive */
@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }
  
  .main-content {
    gap: 20px;
  }
  
  .card {
    padding: 20px;
  }
  
  .devices-table {
    font-size: 0.85rem;
  }
  
  .table-cell {
    padding: 12px 8px;
  }
}
</style>
