const express = require('express');
const router = express.Router();

router.get('/session/:id', (req, res) => {
  res.json({ id: req.params.id, accuracy: 85, duration: '45m' });
});

module.exports = router;





