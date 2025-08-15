const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

class AlertService {
  constructor() {
    // amazonq-ignore-next-line
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_PORT === '465',
      requireTLS: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    
    this.alertThresholds = {
      errorRate: 10, // 10 erros por minuto
      responseTime: 5000, // 5 segundos
      memoryUsage: 90 // 90% da memória
    };
    
    this.errorCount = new Map();
    this.lastAlert = new Map();
    this.alertCooldown = 5 * 60 * 1000; // 5 minutos
  }

  async sendCriticalAlert(error, context = {}) {
    // Não enviar alertas em ambiente de teste
    if (process.env.NODE_ENV === 'test') {
      return;
    }
    
    const alertKey = `${error.name}_${context.url || 'unknown'}`;
    const now = Date.now();
    
    // Verificar cooldown
    if (this.lastAlert.has(alertKey) && 
        (now - this.lastAlert.get(alertKey)) < this.alertCooldown) {
      return;
    }

    const alertData = {
      timestamp: new Date().toISOString(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      context,
      severity: this.getSeverity(error),
      environment: process.env.NODE_ENV || 'development'
    };

    try {
      await this.sendEmailAlert(alertData);
      this.lastAlert.set(alertKey, now);
      logger.info('Alerta crítico enviado', { alertKey, severity: alertData.severity });
    } catch (emailError) {
      logger.error('Falha ao enviar alerta por email', { error: emailError.message });
    }
  }

  async sendEmailAlert(alertData) {
    if (!process.env.SMTP_USER || !process.env.ALERT_EMAIL || !process.env.SMTP_PASS) {
      // Não logar warning em ambiente de teste
      if (process.env.NODE_ENV !== 'test') {
        logger.warn('Configuração de email não encontrada para alertas');
      }
      return;
    }
    
    if (process.env.SMTP_HOST && process.env.SMTP_HOST.includes('gmail.com') && process.env.SMTP_HOST !== 'smtp.gmail.com') {
      logger.warn('Host SMTP inválido. Use smtp.gmail.com para Gmail');
      return;
    }

    const subject = `🚨 ALERTA CRÍTICO - ${alertData.error.name} [${alertData.environment.toUpperCase()}]`;
    
    const html = `
      <h2>🚨 Erro Crítico Detectado</h2>
      <p><strong>Timestamp:</strong> ${alertData.timestamp}</p>
      <p><strong>Ambiente:</strong> ${alertData.environment}</p>
      <p><strong>Severidade:</strong> ${alertData.severity}</p>
      
      <h3>Detalhes do Erro:</h3>
      <p><strong>Tipo:</strong> ${alertData.error.name}</p>
      <p><strong>Mensagem:</strong> ${alertData.error.message}</p>
      
      ${alertData.context.url ? `<p><strong>URL:</strong> ${alertData.context.url}</p>` : ''}
      ${alertData.context.method ? `<p><strong>Método:</strong> ${alertData.context.method}</p>` : ''}
      ${alertData.context.ip ? `<p><strong>IP:</strong> ${alertData.context.ip}</p>` : ''}
      
      <h3>Stack Trace:</h3>
      <pre style="background: #f4f4f4; padding: 10px; overflow-x: auto;">
${alertData.error.stack}
      </pre>
    `;

    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.ALERT_EMAIL,
      subject,
      html
    });
  }

  getSeverity(error) {
    const criticalErrors = [
      'DatabaseConnectionError',
      'AuthenticationError',
      'ValidationError',
      'ReferenceError',
      'TypeError'
    ];
    
    if (criticalErrors.includes(error.name) || error.statusCode >= 500) {
      return 'CRITICAL';
    }
    
    if (error.statusCode >= 400) {
      return 'HIGH';
    }
    
    return 'MEDIUM';
  }

  trackError(error, context = {}) {
    const minute = Math.floor(Date.now() / 60000);
    const key = `${minute}`;
    
    if (!this.errorCount.has(key)) {
      this.errorCount.set(key, 0);
    }
    
    this.errorCount.set(key, this.errorCount.get(key) + 1);
    
    // Limpar contadores antigos
    for (const [k] of this.errorCount) {
      if (parseInt(k) < minute - 5) {
        this.errorCount.delete(k);
      }
    }
    
    // Verificar threshold
    if (this.errorCount.get(key) >= this.alertThresholds.errorRate) {
      this.sendCriticalAlert(new Error('Taxa de erro elevada'), {
        ...context,
        errorCount: this.errorCount.get(key),
        threshold: this.alertThresholds.errorRate
      });
    }
  }

  monitorSystemHealth() {
    setInterval(() => {
      const memUsage = process.memoryUsage();
      const memPercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;
      
      if (memPercent > this.alertThresholds.memoryUsage) {
        this.sendCriticalAlert(new Error('Uso de memória crítico'), {
          memoryUsage: `${memPercent.toFixed(2)}%`,
          heapUsed: `${(memUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
          heapTotal: `${(memUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`
        });
      }
    }, 60000); // Verificar a cada minuto
  }
}

module.exports = new AlertService();