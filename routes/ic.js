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
  const fields = message.attachments[0].fields;
  for (let field of fields) {
    if (field.value.includes(userId)) return;
  }

  // switch= userId in fields[0].value and action 1
  // switch= userId in fields[1].value and action 0
  // userArray = field.value.match(/\w{9}/g)

  addTitle(fields, action);
  addUserId(fields[action], userId);
  incrementButton(message, action);
};

const addTitle = (fields, action) => {
  if (fields[action].title.length === 0) {
    if (parseInt(action) === 0) {
      fields[action].title = 'In';
    } else {
      fields[action].title = 'Out';
    }
  }
};

const addUserId = (field, userId) => {
  field.value.length === 0
    ? (field.value += `<@${userId}>`)
    : (field.value += `, <@${userId}>`);
};

const incrementButton = (message, action) => {
  const actions = message.attachments[0].actions;
  if (!/\d+/.test(actions[action].text)) {
    actions[action].text += ' 1';

    return;
  }

  const found = actions[action].text.match(/\d+/);
  let int = parseInt(found[0]);
  ++int;
  let newText = found['input'].slice(0, found['index']);
  newText += int;
  actions[action].text = newText;
};

module.exports = router;
