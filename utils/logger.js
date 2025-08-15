const winston = require('winston');
const path = require('path');
const { ElasticsearchTransport } = require('winston-elasticsearch');

const logLevel = process.env.LOG_LEVEL || 'info';
const logDir = path.join(__dirname, '../logs');

// Configuração do Elasticsearch
const esTransportOpts = {
  level: 'info',
  clientOpts: {
    node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
    auth: process.env.ELASTICSEARCH_AUTH ? {
      username: process.env.ELASTICSEARCH_USER || 'elastic',
      password: process.env.ELASTICSEARCH_PASSWORD
    } : undefined
  },
  index: 'cfm-estoque-logs',
  indexTemplate: {
    name: 'cfm-estoque-template',
    pattern: 'cfm-estoque-logs-*',
    settings: {
      number_of_shards: 1,
      number_of_replicas: 0
    }
  }
};

const transports = [
  new winston.transports.File({ 
    filename: path.join(logDir, 'error.log'), 
    level: 'error',
    maxsize: 5242880,
    maxFiles: 5
  }),
  new winston.transports.File({ 
    filename: path.join(logDir, 'combined.log'),
    maxsize: 5242880,
    maxFiles: 5
  })
];

// Adicionar Elasticsearch apenas se configurado
if (process.env.ELASTICSEARCH_URL && process.env.NODE_ENV === 'production') {
  transports.push(new ElasticsearchTransport(esTransportOpts));
}

const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { 
    service: 'cfm-estoque',
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  },
  transports
});

// Console em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

module.exports = logger;