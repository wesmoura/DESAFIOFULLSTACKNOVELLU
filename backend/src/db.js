import mysql from 'mysql2/promise';

/**
 * Configuração e conexão com o banco de dados MySQL
 * 
 * Utiliza connection pool para melhor performance e gerenciamento de conexões
 */
let db;

try {
  db = await mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'devicesdb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  console.log('✅ Conectado ao banco de dados MySQL');
} catch (error) {
  console.error('❌ Erro ao conectar ao MySQL:', error.message);
  console.error('   Certifique-se de que:');
  console.error('   1. O MySQL está rodando');
  console.error('   2. O banco "devicesdb" existe (execute: npm run setup-db)');
  console.error('   3. As credenciais em src/db.js estão corretas');
  console.error('   4. Ou configure as variáveis de ambiente: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME');
  process.exit(1);
}

export { db };
