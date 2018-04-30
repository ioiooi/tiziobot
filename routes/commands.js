const express = require('express');
const router = express.Router();
const attachment = require('../lib/attachment');
const fetch = require('node-fetch');

router.post('/', (req, res) => {
  const { text, user_id } = req.body;
  // HH:mm
  const regex = /([0-1]\d|2[0-3]):[0-5]\d/;
  const str = text.match(regex)[0];
  const hours = parseInt(str.slice(0, 2));
  const minutes = parseInt(str.slice(3, 5));
  const now = Date.now();
  const date = new Date().setHours(hours, minutes);
  console.log(`Timezoneoffset ${new Date().getTimezoneOffset()}`);
  console.log(new Date());
  console.log(date.toString());
  const timeOut = date - now - 120000;

  console.log(`hours: ${hours}, minutes: ${minutes}, timeOut: ${timeOut}`);
  console.log(req.body);

  if (regex.test(text)) {
    res.json(
      createMessage(process.env.SLACK_HASHCODE_CHANNEL_ID, text, user_id)
    );
    setTimeout(() => {
      createReminder(process.env.SLACK_HASHCODE_CHANNEL_ID, user_id);
    }, timeOut);
  } else {
    res.json({ text: 'Provide a 24 hours time format `HH:mm`' });
  }

  // res.status(200).end();
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

const createReminder = (channelId, user) => {
  const message = {
    channel: channelId,
    text: `<@${user}> go in 2 minutes`,
    user
  };

  fetch('https://slack.com/api/chat.postEphemeral', {
    method: 'POST',
    body: JSON.stringify(message),
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`
    }
  })
    .then(res => res.json())
    .then(json => console.log(json));
};

module.exports = router;
