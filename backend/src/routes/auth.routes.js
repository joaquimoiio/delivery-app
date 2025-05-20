// src/routes/auth.routes.js
const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { validationMiddleware } = require('../middlewares/validation.middleware');
const router = express.Router();

// Rota para registro de usuários
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
    body('phone').notEmpty().withMessage('Telefone é obrigatório'),
    body('address').notEmpty().withMessage('Endereço é obrigatório'),
    body('user_type').isIn(['cliente', 'lojista']).withMessage('Tipo de usuário inválido')
  ],
  validationMiddleware,
  authController.register
);

// Rota para login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('Senha é obrigatória')
  ],
  validationMiddleware,
  authController.login
);

module.exports = router;