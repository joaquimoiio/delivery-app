// src/config/database.js
const mysql = require('mysql2/promise');
require('dotenv').config();

// Configurações do banco de dados
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'delivery_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Função para testar a conexão com o banco de dados
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Conexão com banco de dados estabelecida com sucesso!');
    connection.release();
    return true;
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error.message);
    return false;
  }
}

module.exports = {
  pool,
  testConnection
};