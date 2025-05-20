// src/app.js
const express = require('express');
const cors = require('cors');
const path = require('path');

// Importação das rotas
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const storeRoutes = require('./routes/store.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const reviewRoutes = require('./routes/review.routes');

// Middlewares de erro
const { notFoundHandler, errorHandler } = require('./middlewares/error.middleware');

const app = express();

// Configurações de middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Pasta para arquivos estáticos (imagens de produtos e lojas)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);

// Rota base da API
app.get('/api', (req, res) => {
  res.json({ message: 'Bem-vindo à API do sistema de delivery!' });
});

// Middleware para rotas não encontradas
app.use(notFoundHandler);

// Middleware para tratamento de erros
app.use(errorHandler);

module.exports = app;