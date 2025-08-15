// amazonq-ignore-next-line
const express = require('express');
const router = express.Router();
// amazonq-ignore-next-line
const healthMonitor = require('../middleware/healthMonitor');

router.get('/health', (req, res) => {
  const healthStatus = healthMonitor.getHealthStatus();
  res.json(healthStatus);
});

router.get('/health/detailed', (req, res) => {
  const healthStatus = healthMonitor.getHealthStatus();
  const detailedStatus = {
    ...healthStatus,
    system: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      pid: process.pid
    },
    environment: process.env.NODE_ENV || 'development'
  };
  
  res.json(detailedStatus);
});

module.exports = router;