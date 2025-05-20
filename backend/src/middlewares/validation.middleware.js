// src/middlewares/validation.middleware.js
const { validationResult } = require('express-validator');

/**
 * Middleware para validação de dados utilizando express-validator
 */
function validationMiddleware(req, res, next) {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Erro de validação',
      errors: errors.array() 
    });
  }
  
  next();
}

module.exports = { validationMiddleware };