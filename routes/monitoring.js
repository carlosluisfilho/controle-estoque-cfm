const express = require('express');
const router = express.Router();
const healthMonitor = require('../middleware/healthMonitor');

router.get('/metrics', (req, res) => {
  const metrics = {
    ...healthMonitor.getHealthStatus(),
    alerts: getRecentAlerts()
  };
  res.json(metrics);
});

function getRecentAlerts() {
  return [
    {
      timestamp: new Date().toISOString(),
      message: 'Sistema funcionando normalmente',
      severity: 'info'
    }
  ];
}

module.exports = router;