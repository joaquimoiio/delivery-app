// src/routes/user.routes.js
const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validationMiddleware } = require('../middlewares/validation.middleware');
const router = express.Router();

// Middleware de autenticação para todas as rotas
router.use(authenticate);

// Rota para obter perfil do usuário
router.get('/profile', userController.getProfile);

// Rota para atualizar perfil do usuário
router.put(
  '/profile',
  [
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    body('phone').notEmpty().withMessage('Telefone é obrigatório'),
    body('address').notEmpty().withMessage('Endereço é obrigatório')
  ],
  validationMiddleware,
  userController.updateProfile
);

// Rota para atualizar senha do usuário
router.put(
  '/password',
  [
    body('currentPassword').notEmpty().withMessage('Senha atual é obrigatória'),
    body('newPassword').isLength({ min: 6 }).withMessage('Nova senha deve ter no mínimo 6 caracteres')
  ],
  validationMiddleware,
  userController.updatePassword
);

module.exports = router;