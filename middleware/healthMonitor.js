const alertService = require('../services/alertService');
const logger = require('../utils/logger');

class HealthMonitor {
  constructor() {
    this.requestTimes = [];
    this.startTime = Date.now();
    this.requestCount = 0;
    this.errorCount = 0;
  }

  middleware() {
    return (req, res, next) => {
      const start = Date.now();
      
      res.on('finish', () => {
        const duration = Date.now() - start;
        this.requestTimes.push(duration);
        this.requestCount++;
        
        // Manter apenas os últimos 100 requests
        if (this.requestTimes.length > 100) {
          this.requestTimes.shift();
        }
        
        // Alerta para tempo de resposta alto
        if (duration > 5000) {
          alertService.sendCriticalAlert(
            new Error('Tempo de resposta elevado'),
            {
              url: req.url,
              method: req.method,
              responseTime: `${duration}ms`,
              threshold: '5000ms'
            }
          );
        }
        
        if (res.statusCode >= 500) {
          this.errorCount++;
        }
      });
      
      next();
    };
  }

  getHealthStatus() {
    const uptime = Date.now() - this.startTime;
    const avgResponseTime = this.requestTimes.length > 0 
      ? this.requestTimes.reduce((a, b) => a + b, 0) / this.requestTimes.length 
      : 0;
    
    const errorRate = this.requestCount > 0 
      ? (this.errorCount / this.requestCount) * 100 
      : 0;
    
    const memUsage = process.memoryUsage();
    
    return {
      status: 'healthy',
      uptime: Math.floor(uptime / 1000),
      requests: {
        total: this.requestCount,
        errors: this.errorCount,
        errorRate: `${errorRate.toFixed(2)}%`
      },
      performance: {
        avgResponseTime: `${avgResponseTime.toFixed(2)}ms`,
        memoryUsage: {
          used: `${(memUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
          total: `${(memUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
          percentage: `${((memUsage.heapUsed / memUsage.heapTotal) * 100).toFixed(2)}%`
        }
      },
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = new HealthMonitor();