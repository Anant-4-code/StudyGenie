const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ route: 'learning', status: 'ok' });
});

module.exports = router;
