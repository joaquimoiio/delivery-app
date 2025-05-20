// src/routes/review.routes.js
const express = require('express');
const { body } = require('express-validator');
const reviewController = require('../controllers/auth.controller');
const { authenticate, isCustomer } = require('../middlewares/auth.middleware');
const { validationMiddleware } = require('../middlewares/validation.middleware');
const router = express.Router();

// Obter avaliações de uma loja (rota pública)
router.get('/store/:storeId', reviewController.getStoreReviews);

// Middleware de autenticação para as próximas rotas
router.use(authenticate);

// Criar avaliação (apenas para clientes)
router.post(
  '/',
  isCustomer,
  [
    body('storeId').isNumeric().withMessage('ID da loja inválido'),
    body('orderId').isNumeric().withMessage('ID do pedido inválido'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Avaliação deve ser entre 1 e 5'),
    body('comment').notEmpty().withMessage('Comentário é obrigatório')
  ],
  validationMiddleware,
  reviewController.createReview
);

module.exports = router;