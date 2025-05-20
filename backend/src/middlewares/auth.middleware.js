// src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar se o usuário está autenticado
 */
function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }
    
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2) {
      return res.status(401).json({ message: 'Erro no formato do token' });
    }
    
    const [scheme, token] = parts;
    
    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({ message: 'Formato de token inválido' });
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Token inválido ou expirado' });
      }
      
      req.userId = decoded.id;
      req.userType = decoded.userType;
      return next();
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro de autenticação', error: error.message });
  }
}

/**
 * Middleware para verificar se o usuário é um lojista
 */
function isStore(req, res, next) {
  if (req.userType !== 'lojista') {
    return res.status(403).json({ message: 'Acesso permitido apenas para lojistas' });
  }
  
  return next();
}

/**
 * Middleware para verificar se o usuário é um cliente
 */
function isCustomer(req, res, next) {
  if (req.userType !== 'cliente') {
    return res.status(403).json({ message: 'Acesso permitido apenas para clientes' });
  }
  
  return next();
}

module.exports = {
  authenticate,
  isStore,
  isCustomer
};

// src/middlewares/error.middleware.js
/**
 * Middleware para tratar rotas não encontradas
 */
function notFoundHandler(req, res, next) {
  res.status(404).json({ message: 'Recurso não encontrado' });
}

/**
 * Middleware para tratamento de erros
 */
function errorHandler(err, req, res, next) {
  console.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor';
  
  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};