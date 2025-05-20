// src/routes/order.routes.js
const express = require('express');
const { body } = require('express-validator');
const orderController = require('../controllers/auth.controller');
const { authenticate, isCustomer } = require('../middlewares/auth.middleware');
const { validationMiddleware } = require('../middlewares/validation.middleware');
const router = express.Router();

// Middleware de autenticação para todas as rotas
router.use(authenticate);

// Listar pedidos do usuário (cliente vê seus pedidos, lojista vê pedidos de sua loja)
router.get('/', orderController.getOrders);

// Obter pedido por ID
router.get('/:id', orderController.getOrderById);

// Criar pedido (apenas para clientes)
router.post(
  '/',
  isCustomer,
  [
    body('storeId').isNumeric().withMessage('ID da loja inválido'),
    body('items').isArray({ min: 1 }).withMessage('O pedido deve ter pelo menos um item'),
    body('items.*.productId').isNumeric().withMessage('ID do produto inválido'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantidade deve ser no mínimo 1'),
    body('deliveryAddress').notEmpty().withMessage('Endereço de entrega é obrigatório'),
    body('paymentMethod').isIn(['dinheiro', 'cartao_credito', 'cartao_debito', 'pix'])
      .withMessage('Método de pagamento inválido')
  ],
  validationMiddleware,
  orderController.createOrder
);

// Atualizar status do pedido (apenas para lojistas)
router.patch(
  '/:id/status',
  [
    body('status').isIn(['pendente', 'confirmado', 'preparando', 'saiu_para_entrega', 'entregue', 'cancelado'])
      .withMessage('Status inválido')
  ],
  validationMiddleware,
  orderController.updateOrderStatus
);

module.exports = router;