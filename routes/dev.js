const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/foo', (req, res) => {
  const conversationId = process.env.SLACK_HASHCODE_CHANNEL_ID;

  const message = {
    channel: conversationId,
    text: `go in 2 minutes`,
    user: <insertUserToken>
  };

  fetch('https://slack.com/api/chat.postEphemeral', {
    method: 'POST',
    body: JSON.stringify(message),
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${process.env.SLACK_BOT_TOKEN}`
    }
  })
    .then(res => res.json())
    .then(json => console.log(json));

  res.status(200).end();
});

router.get('/bar', (req, res) => {
  res.send('sup');
});

module.exports = router;
