// src/routes/store.routes.js
const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');
const path = require('path');
const storeController = require('../controllers/auth.controller');
const { authenticate, isStore } = require('../middlewares/auth.middleware');
const { validationMiddleware } = require('../middlewares/validation.middleware');
const router = express.Router();

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/stores'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limitar tamanho para 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    
    cb(new Error('Apenas imagens nos formatos jpeg, jpg, png e webp são permitidas'));
  }
});

// Rotas públicas
// Listar todas as lojas (com filtros opcionais)
router.get('/', storeController.getStores);

// Obter loja por ID
router.get('/:id', storeController.getStoreById);

// Rotas que requerem autenticação
router.use(authenticate);

// Criar loja (apenas para lojistas)
router.post(
  '/',
  isStore,
  upload.single('logo'),
  [
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    body('description').notEmpty().withMessage('Descrição é obrigatória'),
    body('category').notEmpty().withMessage('Categoria é obrigatória'),
    body('address').notEmpty().withMessage('Endereço é obrigatório'),
    body('delivery_fee').isNumeric().withMessage('Taxa de entrega deve ser um número'),
    body('avg_delivery_time').isNumeric().withMessage('Tempo médio de entrega deve ser um número')
  ],
  validationMiddleware,
  storeController.createStore
);

// Atualizar loja (apenas para o dono da loja)
router.put(
  '/:id',
  isStore,
  upload.single('logo'),
  [
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    body('description').notEmpty().withMessage('Descrição é obrigatória'),
    body('category').notEmpty().withMessage('Categoria é obrigatória'),
    body('address').notEmpty().withMessage('Endereço é obrigatório'),
    body('delivery_fee').isNumeric().withMessage('Taxa de entrega deve ser um número'),
    body('avg_delivery_time').isNumeric().withMessage('Tempo médio de entrega deve ser um número'),
    body('is_open').isBoolean().withMessage('Status de abertura inválido')
  ],
  validationMiddleware,
  storeController.updateStore
);

// Remover loja (apenas para o dono da loja)
router.delete('/:id', isStore, storeController.deleteStore);

module.exports = router;