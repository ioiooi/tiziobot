const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const payload = JSON.parse(req.body['payload']);
  const action = payload.actions[0].value;
  const userId = payload.user.id;
  const responseMessage = payload.original_message;

  updateFields(responseMessage, action, userId);

  res.json(responseMessage);
});

// menus actions with "data_source: external" get send here
router.post('/menus', (req, res) => {
  console.log(req.body);
  res.sendStatus(200);
});

const updateFields = (message, action, userId) => {
  for (let obj of message.attachments[0].fields) {
    if (obj.value.includes(userId)) return;
  }

  if (message.attachments[0].fields[action].title.length === 0) {
    action == 0
      ? (message.attachments[0].fields[action].title = 'In')
      : (message.attachments[0].fields[action].title = 'Out');
  }

  message.attachments[0].fields[action].value.length === 0
    ? (message.attachments[0].fields[action].value += `<@${userId}>`)
    : (message.attachments[0].fields[action].value += `, <@${userId}>`);

  incrementButton(message, action);
};

const incrementButton = (message, action) => {
  if (!/\d+/.test(message.attachments[0].actions[action].text)) {
    message.attachments[0].actions[action].text += ' 1';

    return;
  }

  const found = message.attachments[0].actions[action].text.match(/\d+/);
  let int = parseInt(found[0]);
  ++int;
  let newText = found['input'].slice(0, found['index']);
  newText += int;
  message.attachments[0].actions[action].text = newText;
};

module.exports = router;
