const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const { challenge } = req.body;
  res.send(challenge);
});

module.exports = router;
