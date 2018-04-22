const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const web = req.app.get('web');
  const { text, user_id } = req.body;

  if (regex.test(text)) {
    web.chat
      .postMessage(createMessage(process.env.SLACK_HASHCODE_CHANNEL_ID, text))
      .then(res => console.log(`Message sent ${res.ts}`))
      .catch(console.error);
  } else {
    web.chat
      .postEphemeral({
        channel: process.env.SLACK_HASHCODE_CHANNEL_ID,
        text: '`Provide a 24 hours time format `HH:mm`',
        user: user_id
      })
      .then(res => console.log(`Message sent ${res.ts}`))
      .catch(console.error);
  }

  res.status(200).end();
});

const regex = /([0-1]\d|2[0-3]):[0-5]\d/;
const createMessage = (channelId, text) => {
  return {
    channel: channelId,
    text: `Tizio ${text} Uhr?`,
    attachments: [
      {
        fallback: 'foobar.',
        color: 'good',
        text: 'You in or you out?!',
        callback_id: 'tizio_lunch',
        attachment_type: 'default',
        actions: [
          {
            name: 'tizio_in',
            text: ':spaghetti:',
            type: 'button',
            style: 'primary',
            value: 0
          },
          {
            name: 'tizio_out',
            text: ':no_pedestrians:',
            type: 'button',
            value: 1
          }
        ],
        fields: [{}, {}]
      }
    ]
  };
};

module.exports = router;
