const express = require('express');
const router = express.Router();

router.get('/foo', (req, res) => {
  const web = req.app.get('web');
  const conversationId = process.env.SLACK_HASHCODE_CHANNEL_ID;

  const message = {
    channel: conversationId,
    text: `sup sup sup`,
    attachments: [
      {
        fallback: 'foobar.',
        color: 'good',
        text: 'Hey you!',
        callback_id: 'test_inter_message',
        attachment_type: 'default',
        actions: [
          {
            name: 'tizio',
            text: ':spaghetti:',
            type: 'button',
            value: 'firstAction'
          },
          {
            name: 'tizio',
            text: ':no_pedestrians:',
            type: 'button',
            value: 'secondAction'
          }
        ]
      }
    ]
  };

  web.chat
    .postMessage(message)
    .then(res => console.log(`Message sent ${res.ts}`))
    .catch(console.error);

  res.status(200).end();
});

router.get('/bar', (req, res) => {
  res.send('sup');
});

module.exports = router;
