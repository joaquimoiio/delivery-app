// src/utils/logger.js
const winston = require('winston');
const path = require('path');

// Configuração dos logs
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'delivery-app' },
  transports: [
    // Console logger
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(
          info => `${info.timestamp} ${info.level}: ${info.message}`
        )
      )
    }),
    
    // File logger - erros
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/error.log'),
      level: 'error'
    }),
    
    // File logger - todos os logs
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/combined.log')
    })
  ]
});

// Se não estiver em produção, também escreve logs coloridos no console
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Exporta um wrapper para o logger
module.exports = {
  info: (message, meta = {}) => logger.info(message, meta),
  error: (message, error) => {
    if (error instanceof Error) {
      logger.error(`${message}: ${error.message}`, { 
        stack: error.stack,
        ...error
      });
    } else {
      logger.error(message, error);
    }
  },
  warn: (message, meta = {}) => logger.warn(message, meta),
  debug: (message, meta = {}) => logger.debug(message, meta)
};