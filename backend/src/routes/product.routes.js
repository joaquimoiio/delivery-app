// src/routes/product.routes.js
const express = require('express');
const { body, query } = require('express-validator');
const multer = require('multer');
const path = require('path');
const productController = require('../controllers/auth.controller');
const { authenticate, isStore } = require('../middlewares/auth.middleware');
const { validationMiddleware } = require('../middlewares/validation.middleware');
const router = express.Router();

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/products'));
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
// Listar produtos de uma loja (com filtro opcional por categoria)
router.get(
  '/',
  [
    query('storeId').notEmpty().withMessage('ID da loja é obrigatório')
  ],
  validationMiddleware,
  productController.getProducts
);

// Obter produto por ID
router.get('/:id', productController.getProductById);

// Rotas que requerem autenticação
router.use(authenticate);

// Rotas de categoria de produto
// Listar categorias de uma loja
router.get(
  '/categories',
  [
    query('storeId').notEmpty().withMessage('ID da loja é obrigatório')
  ],
  validationMiddleware,
  productController.getCategories
);

// Criar categoria (apenas para lojistas)
router.post(
  '/categories',
  isStore,
  [
    body('storeId').notEmpty().withMessage('ID da loja é obrigatório'),
    body('name').notEmpty().withMessage('Nome é obrigatório')
  ],
  validationMiddleware,
  productController.createCategory
);

// Atualizar categoria (apenas para o dono da loja)
router.put(
  '/categories/:id',
  isStore,
  [
    body('name').notEmpty().withMessage('Nome é obrigatório')
  ],
  validationMiddleware,
  productController.updateCategory
);

// Remover categoria (apenas para o dono da loja)
router.delete('/categories/:id', isStore, productController.deleteCategory);

// Rotas de produto
// Criar produto (apenas para lojistas)
router.post(
  '/',
  isStore,
  upload.single('image'),
  [
    body('storeId').notEmpty().withMessage('ID da loja é obrigatório'),
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    body('price').isNumeric().withMessage('Preço deve ser um número')
  ],
  validationMiddleware,
  productController.createProduct
);

// Atualizar produto (apenas para o dono da loja)
router.put(
  '/:id',
  isStore,
  upload.single('image'),
  [
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    body('price').isNumeric().withMessage('Preço deve ser um número')
  ],
  validationMiddleware,
  productController.updateProduct
);

// Remover produto (apenas para o dono da loja)
router.delete('/:id', isStore, productController.deleteProduct);

module.exports = router;