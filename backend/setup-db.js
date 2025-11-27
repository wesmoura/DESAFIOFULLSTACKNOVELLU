import mysql from 'mysql2/promise';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function setupDatabase() {
  let connection;
  
  try {
    // Conectar sem especificar database primeiro
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: ''
    });

    console.log('✅ Conectado ao MySQL');

    // Ler e executar o schema SQL
    const schemaPath = join(__dirname, '..', 'database', 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');
    
    // Dividir por ponto e vírgula e executar cada comando
    const statements = schema.split(';').filter(s => s.trim().length > 0);
    
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.query(statement);
      }
    }

    console.log('✅ Banco de dados "devicesdb" criado com sucesso!');
    console.log('✅ Tabela "devices" criada com sucesso!');
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Erro: Não foi possível conectar ao MySQL.');
      console.error('   Certifique-se de que o MySQL está rodando.');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('❌ Erro: Acesso negado ao MySQL.');
      console.error('   Verifique as credenciais em backend/src/db.js');
    } else if (error.code === 'ER_DB_CREATE_EXISTS') {
      console.log('⚠️  Banco de dados já existe. Continuando...');
    } else {
      console.error('❌ Erro ao criar banco de dados:', error.message);
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();

