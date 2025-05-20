// src/server.js
require('dotenv').config();
const app = require('./app');
const { testConnection } = require('./config/database');

const PORT = process.env.PORT || 5000;

// Iniciar o servidor somente se a conexão com o banco de dados for bem-sucedida
async function startServer() {
  const dbConnected = await testConnection();
  
  if (dbConnected) {
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } else {
    console.error('Não foi possível iniciar o servidor devido a erro na conexão com o banco de dados');
    process.exit(1);
  }
}

startServer();