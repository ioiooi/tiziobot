const express = require('express');
const router = express.Router();
const attachment = require('../lib/attachment');

router.post('/', (req, res) => {
  const { text, user_id } = req.body;
  // HH:mm
  const regex = /([0-1]\d|2[0-3]):[0-5]\d/;
  
  if (regex.test(text)) {
    res.json(
      createMessage(process.env.SLACK_LUNCHABLES_CHANNEL_ID, text, user_id)
    );
  } else {
    res.json({ text: 'Provide a 24 hours time format `HH:mm`' });
  }

  res.status(200).end();
});

const createMessage = (channelId, text, user) => {
  const inArr = [user];

  return {
    channel: channelId,
    response_type: 'in_channel',
    text: `<!channel> Tizio ${text} Uhr?`,
    attachments: attachment.createAttachment(inArr, [])
  };
};

module.exports = router;
