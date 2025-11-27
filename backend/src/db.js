import mysql from 'mysql2/promise';

let db;

try {
  db = await mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'devicesdb',
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
  process.exit(1);
}

export { db };
